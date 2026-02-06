# How to run the app and see your latest changes

Follow these steps **in order** so you always see the latest code (e.g. "Dashboard +", Part Photo).

---

## Step 1: Open the project in Cursor

1. Open **Cursor**.
2. Go to **File → Open Folder** (or **Open**).
3. Choose this folder: **`3D Printer Filament Tracker`**  
   (It’s inside `Filament Tracker App` on your Mac.)
4. Confirm you see in the sidebar: `package.json`, `src`, `index.html`, etc.

You must have **this** folder open, not another project.

---

## Step 2: Open the terminal in Cursor

1. Go to **View → Terminal** (or press **Ctrl + `** on Mac, or **Ctrl + J** then click Terminal).
2. The terminal should open at the **bottom** of Cursor.
3. The path at the start of the line should end with **`3D Printer Filament Tracker`** or similar.  
   If not, run:
   ```bash
   cd "/Users/darienmenendez/Documents/Filament Tracker App/3D Printer Filament Tracker"
   ```

---

## Step 3: Start the dev server

1. In that terminal, type exactly:
   ```bash
   npm run dev
   ```
2. Press **Enter**.
3. Wait until you see something like:
   ```text
   VITE v6.x.x  ready in xxx ms
   → Local:   http://localhost:5173/
   → Network: http://192.168.x.x:5173/
   ```
4. **Leave this terminal open.** Do not close it and do not press Ctrl+C.

---

## Step 4: Open the app in your browser (correct link)

1. On your **Mac**, open **Chrome** or **Safari**.
2. In the **address bar**, type exactly:
   ```text
   http://localhost:5173/
   ```
   - Use **http** (not https).
   - Use **localhost**.
   - Use **5173**.
   - End with **/** (nothing after the slash).
3. Press **Enter**.

You should see the app. The first screen should say **"Dashboard +"** at the top.  
If you see **"Dashboard"** without the **+**, you are still on an old or wrong link.

---

## Step 5: If you want to open it on your phone

1. Your **phone** and **Mac** must be on the **same Wi‑Fi**.
2. In the terminal (from Step 3), find the line that says **Network:**  
   e.g. `http://192.168.1.xxx:5173/`
3. On your **phone**, open **Safari** or **Chrome**.
4. In the address bar, type that **full** URL (with your Mac’s numbers), e.g.:
   ```text
   http://192.168.18.31:5173/
   ```
5. Press Go.

Again, the first screen should show **"Dashboard +"**.

---

## Links that will NOT show the latest changes

- **GitHub Pages** (e.g. `https://...github.io/FilTracker/` or similar) → shows the last **deployed** build, not your local changes.
- A **bookmark** or **saved link** that points to GitHub Pages or an old URL.
- The **PWA / “Add to Home Screen”** on your phone → that was saved from an old URL; it won’t update until you add to home screen again **from** the correct `http://...:5173/` URL.

---

## Quick check

- You see **"Dashboard +"** → you’re on the right link and the latest code.
- You see **"Dashboard"** (no +) → you’re on the wrong link or an old build; use **http://localhost:5173/** (or the Network URL on phone) as above.
