# Service Request API

## Setup

1. From the workspace root, run `docker compose up -d` to start PostgreSQL and Redis.
2. In `server/`, run `npm install` and copy `.env.example` to `.env`.
3. Set a random `JWT_SECRET`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` in `.env`.
4. Run `npm run build`, `npm run db:deploy`, and `npm run db:seed`.
5. Run `npm run dev`. The API starts the overdue scheduler automatically.

The API listens on `http://localhost:4000`. Swagger UI is at `/api/docs`; `/api/health` checks the database. The client runs separately on port 5173. The dashboard still serves database results when Redis is unavailable.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with reload |
| `npm run db:deploy` | Apply checked-in Prisma migrations |
| `npm run db:seed` | Create/update the configured admin |
| `npm run check` | Type-check server and seed |
| `npm run test:logic` | Compile and run focused validation tests |
| `npm run build` | Generate Prisma client and compile TypeScript |

Never commit `.env`. Registration creates employee accounts only. The admin account comes from the seed command.

## Vercel deployment

Deploy `server/` and `client/` as separate Vercel projects. Each project must use its own directory as the Root Directory. The server exports `src/app.ts` as the Vercel Express function; `src/server.ts` remains the local process entry.

Set these **server** environment variables in Vercel Production (and Preview if used):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Supabase **transaction pooler** URL on port `6543`, with `?pgbouncer=true&connection_limit=1` (or `&` if the URL already has parameters). Use the database password, not an API key. |
| `REDIS_URL` | Upstash **TCP** URL beginning `rediss://` for `ioredis`. The Upstash REST URL is not compatible with this client. |
| `JWT_SECRET` | A long random secret. Use the same value across deployments so existing sessions remain valid. |
| `CLIENT_ORIGIN` | `https://fe-service-request.vercel.app` (no trailing slash). |

Vercel supplies `PORT`; it is only needed for local development. The frontend `vercel.json` forwards `/api/*` to `https://be-service-request.vercel.app/api/*`, then falls back to `index.html` for React routes. Deploy the backend first, then the frontend. If the backend URL changes, update the frontend rewrite destination and redeploy.

Apply migrations **once**, outside the Vercel function, using a Supabase direct or session pooler connection on port `5432` as `DATABASE_URL` for `npm run db:deploy`. Then set `ADMIN_EMAIL` and `ADMIN_PASSWORD` locally and run `npm run db:seed` once. Do not run migrations or seeding on every function invocation or frontend build. Never put database, Redis, or JWT secrets in the client project.

Check `https://be-service-request.vercel.app/api/health` for a 200 response, then check `https://fe-service-request.vercel.app/api/health` for the same result through the frontend rewrite. `/api/docs` is also available on both domains. If health returns 503, inspect the backend function log and Supabase connection URL; if it returns 404, check the backend project Root Directory and Express function detection.

The five-minute overdue scheduler in `src/server.ts` runs only in the local long-running process. Vercel functions do not provide a continuous timer; overdue reconciliation needs a scheduled HTTP invocation before its timestamp and flags can stay current in production. Vercel Hobby cron is limited to daily frequency, so the existing five-minute behavior requires a plan that supports it or an external scheduler.
