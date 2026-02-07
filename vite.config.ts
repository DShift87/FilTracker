import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const isProd = process.env.NODE_ENV === 'production'
// VITE_APP_BASE=/ for Firebase Hosting; otherwise production uses GitHub Pages path
// Dev: root so app is at http://localhost:5173/
const base = process.env.VITE_APP_BASE ?? (isProd ? '/FilTracker/' : '/')

// Plugin: serve correct manifest (start_url matches base) for dev and build
function manifestPlugin() {
  return {
    name: 'manifest-base',
    configureServer(server) {
      const devPublic = path.resolve(__dirname, 'public/3d-printer-tracker')
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/manifest.webmanifest' || url === '/3d-printer-tracker/manifest.webmanifest') {
          try {
            const manifest = JSON.parse(fs.readFileSync(path.join(devPublic, 'manifest.webmanifest'), 'utf-8'))
            manifest.start_url = base
            res.setHeader('Content-Type', 'application/manifest+json')
            res.end(JSON.stringify(manifest))
            return
          } catch { }
        }
        if (url === '/icon.svg' || url === '/icon-192.png' || url === '/icon-512.png') {
          try {
            const filePath = path.join(devPublic, path.basename(url))
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', url.endsWith('.svg') ? 'image/svg+xml' : 'image/png')
              res.end(fs.readFileSync(filePath))
              return
            }
          } catch { }
        }
        next()
      })
    },
    closeBundle() {
      try {
        const manifestPath = path.resolve(__dirname, 'public/3d-printer-tracker/manifest.webmanifest')
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
        manifest.start_url = base
        const forFirebase = !!process.env.VITE_APP_BASE
        const distDir = path.resolve(__dirname, 'dist', forFirebase ? '' : (isProd ? 'FilTracker' : '3d-printer-tracker'))
        fs.mkdirSync(distDir, { recursive: true })
        if (forFirebase) {
          manifest.icons = [
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          ]
        }
        fs.writeFileSync(path.join(distDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2))
        if (isProd || forFirebase) {
          const icons = ['icon.svg', 'icon-192.png', 'icon-512.png']
          const srcDir = path.resolve(__dirname, 'public/3d-printer-tracker')
          icons.forEach((name) => {
            const src = path.join(srcDir, name)
            if (fs.existsSync(src)) fs.copyFileSync(src, path.join(distDir, name))
          })
        }
      } catch (_) {}
    },
  }
}

export default defineConfig({
  base,
  server: {
    host: true, // Listen on all addresses so you can open the app on your phone
    port: 5173,
  },
  plugins: [
    manifestPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  transformIndexHtml(html) {
    return html.replace(/<base href="[^"]*" \/>/, `<base href="${base}" />`)
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})