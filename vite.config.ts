import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? '/3d-printer-tracker/' : '/'

// Plugin: serve correct manifest (start_url matches base) for dev and build
function manifestPlugin() {
  return {
    name: 'manifest-base',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/3d-printer-tracker/manifest.webmanifest')) {
          const manifestPath = path.resolve(__dirname, 'public/3d-printer-tracker/manifest.webmanifest')
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          manifest.start_url = base
          res.setHeader('Content-Type', 'application/manifest+json')
          res.end(JSON.stringify(manifest))
          return
        }
        next()
      })
    },
    closeBundle() {
      const manifestPath = path.resolve(__dirname, 'public/3d-printer-tracker/manifest.webmanifest')
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      manifest.start_url = base
      const distPath = path.resolve(__dirname, 'dist/3d-printer-tracker/manifest.webmanifest')
      fs.mkdirSync(path.dirname(distPath), { recursive: true })
      fs.writeFileSync(distPath, JSON.stringify(manifest, null, 2))
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