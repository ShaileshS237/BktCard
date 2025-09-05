## BktCard

A small React app (created with Create React App) for managing bucket-style cards. The app was hosted as a demo at: https://dashing-biscochitos-0c9acc.netlify.app/

This README focuses on the practical setup and run steps for local development.

## Quick links

- Live demo: https://dashing-biscochitos-0c9acc.netlify.app/
- Source: this repository

## Requirements

- Node.js (14+ recommended)
- npm (comes with Node.js)
- Optional: json-server (used to serve the sample data in `data/db.json`)

## Local setup (development)

1. Install dependencies

   ```powershell
   npm install
   ```

2. Start the sample JSON API (the app expects a small REST API for data).

   From the project root run (PowerShell):

   ```powershell
   # use the local path to the data file on Windows PowerShell
   npx json-server --watch .\data\db.json --port 8000
   ```

   This serves the data at http://localhost:8000 (endpoints mirror the structure in `data/db.json`).

3. Start the React dev server

   ```powershell
   npm start
   ```

   Open http://localhost:3000 to view the app. The React app will make requests to the json-server if it is running on port 8000.

   Notes:

   - If you don't want to run json-server you can also edit `src/services/storage.js` to switch to localStorage or a mock implementation.

## Available scripts

- `npm start` - starts the CRA dev server
- `npm test` - runs tests
- `npm run build` - creates a production build in `build/`

## Project structure (key files)

- `public/` - static assets (icons, manifest, index.html)
- `src/` - React source code
  - `src/Componets/` - React components (Buckets, Cards, Createcard, Navbar)
  - `src/Pages/` - Page components (Home, History)
  - `src/services/storage.js` - small storage layer used by the app
- `data/db.json` - sample JSON data used by json-server

## Deploy

Build the app then deploy the `build/` folder to your static host of choice (Netlify, Vercel, GitHub Pages, etc.)

```powershell
npm run build
```

## Contributing

Small fixes and improvements are welcome. Open a PR and include a short description of the change.

## License

This repository doesn't include a license file. Add one if you plan to publish the project.

---

If you'd like, I can also:

- Add a short developer script to the `package.json` (for starting json-server + react concurrently), or
- Add a short section to `src/services/storage.js` explaining how to switch between json-server and localStorage.

Requirements coverage:

- Update the `README.md` file with clearer setup and run steps: Done
