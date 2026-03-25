# Production-Ready Admin Control Panel

This folder contains a complete full-stack admin panel implementation with modular architecture, robust backend security, normalized database schema, and a responsive modern frontend.

## Architecture (Brief)

- Backend: Node.js + Express + Prisma + SQLite
- Frontend: React + Vite + React Router + React Query
- Auth: JWT in `httpOnly` cookie + CSRF token validation for state-changing requests
- RBAC: `ADMIN` and `USER` roles enforced on protected endpoints and guarded frontend routes
- Database: Normalized schema with indexes, relations, migration SQL, and seed data
- Logging: Centralized `LogEntry` table and API-visible audit logs

## Project Structure

- `backend/`: API layer, auth/RBAC, validation, Prisma schema, migrations, seed
- `frontend/`: responsive admin UI (dashboard, analytics, users, data, settings, logs)

## Key Features

- Login / Register / Logout / Session check
- Dashboard with statistics and recent logs
- Analytics page
- User CRUD (Admin-only)
- Data Record CRUD (with ownership rule + Admin delete)
- Settings CRUD (Admin-only)
- Search, filtering, pagination
- Validation and unified error handling
- Rate limiting, Helmet, CORS, secure password hashing
- Query optimization using indexes and a short-lived dashboard cache
- Frontend route lazy loading

## Step-by-Step Run

1. Go to this folder:
   - `cd admin-panel`
2. Install all dependencies:
   - `npm install`
3. Create env files:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
4. Run Prisma migration and generate client:
   - `npm run migrate --workspace backend`
   - `npm run generate --workspace backend`
5. Seed initial data:
   - `npm run seed --workspace backend`
6. Start backend and frontend together:
   - `npm run dev`
7. Open frontend:
   - `http://localhost:5173`

## Demo Credentials

- Admin: `admin@example.com` / `Admin123!`
- User: `user@example.com` / `User123!`

## Security Notes

- Password hashing via bcrypt with 12 salt rounds
- JWT stored in `httpOnly` cookie
- CSRF token required in `x-csrf-token` for mutation endpoints
- Endpoint-level RBAC checks
- Input validation via Zod in all write and list-query endpoints
- Error responses are normalized and safe

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET/POST/PATCH/DELETE /api/users`
- `GET/POST/PATCH/DELETE /api/data`
- `GET/POST/DELETE /api/settings`
- `GET /api/logs`

## Production Tips

- Use PostgreSQL in production (`provider = "postgresql"`) for horizontal scale
- Set secure env values and strict CORS origin
- Serve frontend behind CDN and backend behind reverse proxy
- Add CI checks for lint/test/security scanning

## cPanel One-Command Setup (Inside ZIP)

After uploading and extracting the zip in cPanel terminal:

1. `cd ~/admin-panel-live-YYYYMMDD-HHMM`
2. `chmod +x deploy/cpanel-auto-setup.sh`
3. `PANEL_URL="https://panel.your-domain.com" API_URL="https://api.your-domain.com/api" CORS_ORIGIN="https://panel.your-domain.com" bash deploy/cpanel-auto-setup.sh`

This script automatically:

- installs dependencies
- creates `backend/.env`
- creates `frontend/.env`
- runs Prisma migration and generate
- runs seed (can disable with `RUN_SEED=false`)
- builds frontend

Also see `deploy/cpanel-quick-start.txt`.
