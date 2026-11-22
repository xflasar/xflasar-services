FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json pnpm-lock.yaml* ./
COPY packages/ ./packages/
COPY apps/anime/ ./apps/anime/
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter=@xflasar/types build || true
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter=anime build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3010
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/anime/ ./apps/anime/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/apps/anime/node_modules/ ./apps/anime/node_modules/

WORKDIR /app/apps/anime
EXPOSE 3010
CMD ["pnpm", "start"]
