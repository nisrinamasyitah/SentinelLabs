# Sentinel Labs

Marketing site + client report portal for a (fictional) pentesting firm. React/Vite frontend, Express/Prisma/Postgres backend, magic-link auth.

## Architecture

- `src/` — React 19 + TypeScript + Tailwind v4 frontend (Vite)
- `server/` — Express + TypeScript + Prisma API, Postgres via Docker
- Auth is passwordless: request a magic link by email, click it, get a signed httpOnly session cookie
- The "free scan" flow simulates a Recon → Scan → Exploit → Report engagement server-side (see the in-app disclaimer — it's a demo/lead-gen preview, not a real scan)

## First-time setup

```bash
# 1. start Postgres
npm run db:up

# 2. install + migrate + seed the API
cd server
npm install
cp .env.example .env      # defaults already match docker-compose.yml
npm run prisma:migrate
npm run prisma:seed
cd ..

# 3. install the frontend
npm install
```

## Running it

```bash
npm run dev:all     # runs both the Vite dev server and the API together
```

Or separately: `npm run dev` (frontend, :5173) and `npm run dev:server` (API, :4000). The Vite dev server proxies `/api/*` to the backend, so the browser only ever talks to one origin.

Visit `http://localhost:5173`. Demo accounts (seeded): `dana@acmecorp.com`, `ravi@northwindlogistics.com`.

## Email in dev

No SMTP is configured by default — magic links are logged to the API's console and also returned in the API response (`devLink`), which the UI surfaces as a "continue" button so the whole flow is testable without a real inbox. Set `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM` in `server/.env` to send real email (see `server/.env.example`).

## Database

`docker-compose.yml` runs Postgres 16 on `:5432` with a persistent volume. `npm run db:down` stops it (data persists in the volume; add `-v` to `docker compose down` to wipe it). Prisma Studio (`npm run prisma:studio` inside `server/`) is a quick GUI for the database.
