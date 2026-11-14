# Multi-stage Dockerfile for portfolio-api within monorepo
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/portfolio-api/ ./apps/portfolio-api/
RUN pnpm install
RUN pnpm --filter=@xflasar/types build || true
RUN pnpm --filter=portfolio-api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/portfolio-api
EXPOSE 3001
CMD ["node", "dist/index.js"]

