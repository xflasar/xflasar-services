# xflasar

Personal ecosystem monorepo — portfolio, anime tracker, manga tracker.

## Structure

```
apps/
  portfolio/        → xflasar.dev          (Next.js → Vercel)
  anime/            → anime.xflasar.dev    (Next.js → Vercel)
  manga/            → manga.xflasar.dev    (Next.js → Vercel)
  portfolio-api/    → api.xflasar.dev/portfolio/*  (Fastify → Docker)
  anime-api/        → api.xflasar.dev/anime/*      (Fastify → Docker)
  manga-api/        → api.xflasar.dev/manga/*      (Fastify → Docker)
  mal-sync/         → MAL sync cron worker          (Python → Docker)

packages/
  ui/               → Shared React components
  types/            → Shared TypeScript types
```

## Tech stack

| Layer | Tech |
|-------|------|
| Frontends | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| APIs | Fastify 5, TypeScript, Drizzle ORM, Zod |
| Auth | Keycloak (self-hosted) |
| Database | PostgreSQL 16 |
| Workers | Python 3.12 |
| Monorepo | pnpm workspaces + Turborepo |

## Prerequisites

- Node.js 22+
- pnpm 9+
- Access to the Ubuntu server (for DB + Keycloak during dev)

## Setup

```bash
# Install dependencies
pnpm install

# Copy env examples (do this for each app you're working on)
cp apps/portfolio-api/.env.example apps/portfolio-api/.env
# Edit with your server's IP

# Run everything in dev mode
pnpm dev

# Run only one app
pnpm dev --filter=portfolio
pnpm dev --filter=portfolio-api
```

## Dev environment

Your laptop runs the app code. The Ubuntu server runs PostgreSQL + Keycloak.

Set `DATABASE_URL` and `KEYCLOAK_URL` in each app's `.env` to point at your server's local IP:

```
DATABASE_URL=postgresql://xflasar:password@192.168.1.XXX:5432/portfolio
KEYCLOAK_URL=http://192.168.1.XXX:8080
```

## Deploy

After `git push`, SSH into the Ubuntu server and run:

```bash
cd ~/projects/xflasar-infra
./deploy.sh
```

