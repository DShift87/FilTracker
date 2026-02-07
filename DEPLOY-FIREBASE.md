# Step-by-step: Deploy your Filament Tracker so you can use it without your PC

This guide walks you through putting your app on **Firebase Hosting** and using **Firebase Firestore** for data. When you’re done, you can open the app on your phone or any device—no need to keep your computer on.

---

## What you’ll need

- A **Google account** (Gmail).
- A **computer** (Mac or Windows) with:
  - A web browser (Chrome, Safari, or Edge).
  - **Node.js** installed. Check by opening Terminal (Mac) or Command Prompt (Windows) and typing:  
    `node -v`  
    If you see a version number (e.g. `v20.x.x`), you’re good. If not, install from [nodejs.org](https://nodejs.org/) (use the LTS version).
- About **15–20 minutes** the first time.

---

# Part 1: Create and set up your Firebase project

## Step 1.1 – Go to Firebase and sign in

1. Open your browser and go to: **https://console.firebase.google.com**
2. Sign in with your Google account if asked.

---

## Step 1.2 – Create a new project

1. On the Firebase welcome page, click **“Create a project”** (or **“Add project”** if you already have projects).
2. **Project name:** type something like `Filament Tracker` (or any name you like).  
   - You can leave “Google Analytics” **off** for this app. Click **Continue** and then **Create project**.
3. Wait until you see “Your new project is ready.” Click **Continue**.

You should now be on the **Project overview** page (dashboard) for your new project.

---

## Step 1.3 – Enable Firestore (database)

1. In the left sidebar, click **“Build”** to expand it, then click **“Firestore Database”**.
2. Click **“Create database”**.
3. **Security rules:** choose **“Start in test mode”** for now (we’ll use simple rules that allow read/write).  
   - Click **Next**.
4. **Location:** pick a region close to you (e.g. `us-central1` or `europe-west1`).  
   - You can’t change this later. Click **Enable**.
5. Wait until the database is created. You’ll see an empty “Firestore Database” screen. That’s correct.

Firestore is now the cloud database your app will use for filaments, parts, and projects.

---

## Step 1.4 – Enable Hosting (so the app has a URL)

1. In the left sidebar, under **“Build”**, click **“Hosting”**.
2. Click **“Get started”**.
3. You’ll see a short guide. You can close it or click **“Next”** until you’re back on the Hosting page.

Hosting is enabled. You’ll upload your built app in Part 3.

---

## Step 1.5 – Register a web app and get your config

1. In the left sidebar, click the **gear icon** next to “Project overview”, then click **“Project settings”**.
2. Scroll down to **“Your apps”**. Click the **</>** (web) icon to add a web app.
3. **App nickname:** e.g. `Filament Tracker Web`. Click **“Register app”**.
4. You’ll see a code snippet with something like `firebaseConfig = { ... }`.  
   - **Do not** copy the snippet into your project. We only need the **values** inside it.
5. Copy each value into a text file or notes so you don’t lose them. You need:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
6. Click **“Continue to console”**. You can ignore the “Add Firebase SDK” steps; the app already uses Firebase.

Keep this tab open or keep the values handy—you’ll paste them into the app in Part 2.

---

# Part 2: Configure the app on your computer

## Step 2.1 – Open the app folder in Terminal

1. On your computer, open **Terminal** (Mac: Spotlight → type “Terminal”) or **Command Prompt** (Windows).
2. Go to your project folder. Replace the path with your real path if different:
   ```bash
   cd "/Users/darienmenendez/Documents/Filament Tracker App/3D Printer Filament Tracker"
   ```
3. Confirm you’re in the right place by listing files:
   ```bash
   ls
   ```
   You should see things like `package.json`, `src`, `firebase.json`, `.env.example`.

---

## Step 2.2 – Create the `.env` file with your Firebase config

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in any text editor (VS Code, Notepad, TextEdit, etc.).
3. Replace the placeholders with the values from **Step 1.5**. It should look like this (with your real values):
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...your-api-key...
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef...
   ```
   - No spaces around `=`.
   - No quotes around the values (unless your editor added them).
   - `projectId` and `authDomain`/`storageBucket` usually share the same project id (e.g. `filament-tracker-abc123`).
4. Save the file and close the editor.

---

## Step 2.3 – Tell Firebase CLI which project to use

1. In the same project folder, copy the Firebase project config file:
   ```bash
   cp .firebaserc.example .firebaserc
   ```
2. Open `.firebaserc` in your text editor. It will look like:
   ```json
   {
     "projects": {
       "default": "YOUR_FIREBASE_PROJECT_ID"
     }
   }
   ```
3. Replace `YOUR_FIREBASE_PROJECT_ID` with your real **Project ID** (the same as `VITE_FIREBASE_PROJECT_ID` in `.env`). For example:
   ```json
   {
     "projects": {
       "default": "filament-tracker-abc123"
     }
   }
   ```
4. Save and close.

---

## Step 2.4 – Install Firebase CLI and log in (one-time)

1. In Terminal, install the Firebase tools globally:
   ```bash
   npm install -g firebase-tools
   ```
   - If you get a permission error (Mac/Linux), try:  
     `sudo npm install -g firebase-tools`  
     and enter your computer password.
2. Log in to your Google account:
   ```bash
   firebase login
   ```
3. A browser window will open. Sign in with the **same Google account** you used for Firebase.
4. When it says “Success!”, you can close the browser tab and return to Terminal.

You only need to do this once per computer.

---

## Step 2.5 – Install app dependencies and build for Firebase

1. Make sure you’re in the app folder (same as in Step 2.1). Then install dependencies:
   ```bash
   npm install
   ```
2. Build the app **for Firebase** (so it works at the root URL):
   ```bash
   VITE_APP_BASE=/ npm run build
   ```
   - **Mac/Linux:** that exact command is fine.
   - **Windows (Command Prompt):** use:  
     `set VITE_APP_BASE=/ && npm run build`
   - **Windows (PowerShell):** use:  
     `$env:VITE_APP_BASE="/"; npm run build`
3. Wait until you see something like “built in X seconds” with no red errors.  
   A `dist` folder will appear with the built app.

---

## Step 2.6 – Deploy to Firebase

1. In the same folder, run:
   ```bash
   firebase deploy
   ```
2. The first time, Firebase may ask: “Are you ready to proceed?” Type **Y** and press Enter.
3. Wait until you see:
   - **Hosting:** “Deploy complete!” and a URL like `https://your-project-id.web.app`
   - **Firestore:** “Deploy complete!” (for rules)

4. Copy the **Hosting URL** (e.g. `https://filament-tracker-abc123.web.app`). That’s your app.

Your app is now on the internet. You can close your computer and use the app from your phone.

---

# Part 3: Use the app from your phone (or any device)

## Step 3.1 – Open the app

1. On your **phone** (or another device), open the browser (Safari, Chrome, etc.).
2. In the address bar, type or paste your Hosting URL (e.g. `https://your-project-id.web.app`).
3. Press Go. The Filament Tracker app should load.
4. If you had already set up Firebase and run the app on your PC with the same `.env`, you may see your data (synced via Firestore). If this is a brand‑new project, you’ll see an empty app—add some filaments and parts to test.

You don’t need your PC on anymore; the app and data are on Firebase.

---

## Step 3.2 – Add the app to your home screen (use it like an app)

**On iPhone (Safari):**

1. Open the app URL in **Safari** (not Chrome).
2. Tap the **Share** button (square with arrow, at the bottom or top).
3. Scroll and tap **“Add to Home Screen”**.
4. Edit the name if you want (e.g. “Filament Tracker”), then tap **“Add”**.
5. An icon appears on your home screen. Tap it to open the app in a full‑screen view without the browser bar.

**On Android (Chrome):**

1. Open the app URL in **Chrome**.
2. Tap the **menu** (three dots, top right).
3. Tap **“Install app”** or **“Add to Home screen”** (wording can vary by device).
4. Confirm. The app icon appears on your home screen or app drawer; open it like any other app.

---

# Part 4: When you change the app and want to update the live site

1. On your computer, open the app folder in Terminal (same as Step 2.1).
2. Make your code changes as usual.
3. Build again:
   ```bash
   VITE_APP_BASE=/ npm run build
   ```
4. Deploy again:
   ```bash
   firebase deploy
   ```
5. Reload the app on your phone (or any device)—you’ll see the updates.

---

# Troubleshooting

**“Firebase is not configured” or no cloud sync**  
- Make sure `.env` exists in the app folder (not only `.env.example`).  
- Make sure every line in `.env` has a value (no empty `VITE_FIREBASE_...=`).  
- Rebuild after changing `.env`:  
  `VITE_APP_BASE=/ npm run build`  
  then `firebase deploy`.

**“Permission denied” when running `firebase deploy`**  
- You must be logged in with the same Google account that owns the Firebase project: run `firebase login` again.

**Blank white screen after opening the deployed URL**  
- You must build with `VITE_APP_BASE=/` so the app is built for the root path.  
- Clear the browser cache or try in a private/incognito window.

**Firestore permission errors in the browser console**  
- In Firebase Console → Firestore Database → **Rules**, you can temporarily use test mode rules. For production, restrict rules (e.g. require auth). The repo’s `firestore.rules` is deployed when you run `firebase deploy`.

**I don’t see the Hosting URL after deploy**  
- In Firebase Console → **Hosting**, you’ll see the live URL (e.g. `https://your-project-id.web.app`) and the last deploy time.

---

# Quick reference

| Step | What to do |
|------|------------|
| 1 | Create Firebase project → enable Firestore and Hosting → register web app → copy config. |
| 2 | In app folder: create `.env` from `.env.example` and paste config; create `.firebaserc` from `.firebaserc.example` and set project ID. |
| 3 | Run `npm install -g firebase-tools` and `firebase login` (one-time). |
| 4 | Run `npm install`, then `VITE_APP_BASE=/ npm run build`, then `firebase deploy`. |
| 5 | Open the Hosting URL on your phone; add to home screen from Safari (iOS) or Chrome (Android). |

After this, you can use the app from any device without keeping your PC on; Firebase Hosting serves the app and Firestore stores the data.
