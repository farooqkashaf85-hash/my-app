# My App

A MERN notes application with authentication, notes management, live chat, uploads, and a basic Stripe test checkout flow.

## Quick overview
- Backend: `backend/` — API, controllers, models, and uploads.
- Frontend: `frontend/` — Vite React app in `src/`.

## Prerequisites
- Node.js 18 or newer
- MongoDB (local or Atlas)
- Stripe test-mode account and API keys for checkout

## Quick start

### 1. Configure the backend

Create `backend/.env` from `backend/.env.example` and set:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-at-least-32-characters-long
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

`CORS_ORIGIN` may contain multiple comma-separated frontend origins. The backend also allows `http://localhost:5173` and `http://127.0.0.1:5173` for local development.

### 2. Install and start the backend

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:5000`. Verify it by opening `http://localhost:5000/` and checking for `Server is running`.

### 3. Configure and start the frontend

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Then start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Docker development

With Docker Desktop running, start the complete development environment from the repository root:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:5173`, the API at `http://localhost:5000`, and MongoDB is persisted in the `mongo-data` volume. Source directories are mounted into the frontend and backend containers, so Vite hot reload and backend changes are available during development.

Docker uses the environment variables required by the backend. Set `JWT_SECRET` before running Compose. For Stripe checkout, also provide the Stripe variables through the frontend/backend environment configuration.

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

## API

The backend does not use an `/api` prefix:

- `GET /` — health check
- `POST /users/createuser` — create an account
- `POST /users/login` — login and receive a JWT
- `POST /users/getuser` — get the current user; send the `jwttoken` header
- `GET /users/allusers` — admin-only user list
- `GET /Notes/fetchallnotes` — list notes; send the `jwttoken` header
- `POST /Notes/addnewnote` — create a note
- `PUT /Notes/updatenote/:id` — update a note
- `DELETE /Notes/deletenote/:id` — delete a note
- `POST /payment/create-payment-intent` — create a Stripe Payment Intent in test mode
- `POST /upload` — upload a file

## Stripe checkout

1. Add `STRIPE_SECRET_KEY` to `backend/.env`.
2. Add `VITE_STRIPE_PUBLISHABLE_KEY` to `frontend/.env`.
3. Start both backend and frontend servers.
4. Open `http://localhost:5173/checkout`.

The checkout page requests a client secret from the backend, renders Stripe `PaymentElement`, and redirects to payment success or failure pages. Use Stripe test card `4242 4242 4242 4242`, any future expiry date, and any three-digit CVC.

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

## Testing

The backend tests use Jest for middleware unit tests and Supertest for API integration tests. They cover health checks, request validation, user creation, authentication, authorization, request IDs, and centralized error responses.

```bash
# Backend unit and integration tests
cd backend
npm test

# Frontend component tests
cd ../frontend
npm test
```

Current test status: backend `10` tests passing and frontend `6` tests passing.

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

## Troubleshooting

- If login or signup says `Unable to connect to the server`, confirm the backend is running on port `5000` and `VITE_API_URL` is `http://localhost:5000` rather than `https://localhost:5000`.
- If the browser reports a CORS error, set `CORS_ORIGIN=http://localhost:5173` in `backend/.env`, then restart the backend.
- If checkout reports that Stripe is not configured, add `VITE_STRIPE_PUBLISHABLE_KEY` to `frontend/.env`, then restart Vite.
- Never expose `STRIPE_SECRET_KEY` in frontend code or commit a real secret key.

See `frontend/README.md` for frontend-specific details.

## Author
Project owner

