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

## GitHub Actions delivery

Every pull request and push to `main` runs the backend tests, frontend tests, and frontend production build. A successful push to `main` also builds and publishes the backend and frontend Docker images to GitHub Container Registry:

- `ghcr.io/<owner>/my-app-backend:latest`
- `ghcr.io/<owner>/my-app-frontend:latest`

The workflow is in `.github/workflows/ci-cd.yml`. It uses the built-in `GITHUB_TOKEN`, so no additional registry secret is required. The published images are delivery artifacts; deploying them to a hosting provider still requires that provider's deployment configuration.

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

## Backend reliability and observability

- Requests receive an `x-request-id` response header. Clients can provide their own request ID in the same header; otherwise the backend generates one.
- Every completed HTTP request is written as a JSON log containing the request ID, method, path, status code, and duration.
- Server startup, MongoDB connection events, and Socket.IO connection events use the same structured logger.
- Unmatched routes return a JSON `404` response. Unhandled errors return a JSON response with `success: false`, a safe public error message, and the request ID.
- Internal error logs include the error name, message, stack trace, request method, path, status code, and request ID. These details are not exposed in production responses.

Example error response:

```json
{
  "success": false,
  "error": "Internal server error",
  "requestId": "request-id"
}
```

Run backend tests from the backend directory:

```bash
cd backend
npm test
```

## Project structure

- `backend/`
  - `controllers/` — request handlers (notes, auth, upload)
  - `models/` — Mongoose models (`Users.js`, `Notes.js`)
  - `middleware/` — auth, upload, request logging, and centralized error handling
  - `utils/logger.js` — JSON structured logger
  - `uploads/` — saved files

- `frontend/`
  - `src/` — React app
  - `src/components/` — UI components
  - `src/context/notes/` — notes context and state

## Notes
- This README is intentionally concise. See `frontend/README.md` for frontend-specific details.

## Author
Project owner

