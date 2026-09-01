# My App

A simple notes application with a Node/Express backend and a Vite + React frontend.

## Quick overview
- Backend: `backend/` — API, controllers, models, and uploads.
- Frontend: `frontend/` — Vite React app in `src/`.

## Prerequisites
- Node.js (14+)
- MongoDB (local or Atlas)

## Quick start

Backend (server):

```bash
cd backend
npm install
# then start the server (use the script in backend/package.json)
npm start
```

Frontend (client):

```bash
cd frontend
npm install
npm run dev
```

## Docker development

With Docker Desktop running, start the complete development environment from the repository root:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:5173`, the API at `http://localhost:5000`, and MongoDB is persisted in the `mongo-data` volume. Source directories are mounted into the frontend and backend containers, so Vite hot reload and backend changes are available during development.

Stop the services with:

```bash
docker compose down
```

To remove the persisted MongoDB data as well, run `docker compose down -v`.

If your `package.json` scripts differ, use the corresponding commands.

## Environment
Create a `.env` file in `backend/` with at least:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `PORT` — optional server port (defaults often to 5000)

## API (brief)
- `POST /api/auth/signup` — create user
- `POST /api/auth/login` — login, returns token
- `GET|POST|PUT|DELETE /api/notes` — notes CRUD
- `POST /api/upload` — file upload endpoint

## Project structure

- `backend/`
  - `controllers/` — request handlers (notes, auth, upload)
  - `models/` — Mongoose models (`Users.js`, `Notes.js`)
  - `middleware/` — auth and upload helpers
  - `uploads/` — saved files

- `frontend/`
  - `src/` — React app
  - `src/components/` — UI components
  - `src/context/notes/` — notes context and state

## Notes
- This README is intentionally concise. See `frontend/README.md` for frontend-specific details.

## Author
Project owner

