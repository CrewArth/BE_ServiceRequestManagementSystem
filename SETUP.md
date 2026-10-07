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
