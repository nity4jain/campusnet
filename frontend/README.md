# CampusNet Frontend (Vite + React)

This is a minimal frontend scaffold (JavaScript) that talks to the existing CampusNet backend.

Requirements
- Node.js 18+ and npm

Install and run (PowerShell):

```powershell
cd frontend; npm install; npm run dev
```

Start backend (in project root) in a separate shell:

```powershell
# from repo root
npm install
# set MONGO_URI and JWT_SECRET in .env or environment
npm run dev
```

Make sure your backend is running on http://localhost:5000 (or set `VITE_API_BASE` environment variable).

Notes
- Dev server runs on port 5173 by default to avoid conflicts.
- JWT is stored in localStorage under `campusnet_token`.
