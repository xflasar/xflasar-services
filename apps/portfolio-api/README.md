# Portfolio API (`apps/portfolio-api`)

Fastify microservice providing project showcase and telemetry data for `xflasar.dev`.

## Features
- **Fastify 5** — high-throughput, low-overhead HTTP engine
- **Drizzle ORM** with PostgreSQL — type-safe schema and fast SQL queries
- **Keycloak JWT Auth** — verifies asymmetric RS256 tokens from Keycloak JWKS endpoint
- **Public & Protected Endpoints** — public GET for portfolio visitors, admin-only write operations
- **Zod Validation** — strict runtime validation for request parameters and payloads

---

## Getting Started

### 1. Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` points to your PostgreSQL instance (e.g. `postgresql://xflasar:password@YOUR_SERVER_IP:5432/portfolio`).

### 2. Database Migration & Seeding
From the monorepo root or inside this folder:
```bash
# Generate migrations (if schema modified)
pnpm --filter=portfolio-api db:generate

# Push migrations to Postgres
pnpm --filter=portfolio-api db:migrate

# Seed with initial projects (PUNoted, Gate, Garden, etc.)
pnpm --filter=portfolio-api db:seed
```

### 3. Run Dev Server
```bash
pnpm --filter=portfolio-api dev
```
Server starts on `http://localhost:3001`.

---

## API Endpoints

### Public Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/health` / `/portfolio/health` | Healthcheck and timestamp |
| `GET` | `/portfolio/projects` | List all projects (supports `?category=SOFTWARE\|HARDWARE&featured=true&status=ACTIVE`) |
| `GET` | `/portfolio/projects/featured` | Get spotlight projects (e.g. PUNoted) |
| `GET` | `/portfolio/projects/:id` | Get details of a single project by UUID |

### Protected Endpoints (Admin role required via Keycloak Bearer JWT)
| Method | Route | Description |
|---|---|---|
| `POST` | `/portfolio/projects` | Create a new project |
| `PUT` | `/portfolio/projects/:id` | Update project metadata, stats, or links |
| `DELETE` | `/portfolio/projects/:id` | Remove a project |

