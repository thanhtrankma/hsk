# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

# ---- dependencies -----------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm ci` runs the `postinstall` script (`prisma generate`), which needs the
# schema present, so it has to be copied in before that runs.
COPY prisma ./prisma
RUN npm ci

# ---- build --------------------------------------------------------------
# Also reused directly (via `target: builder`) as the `db-setup` one-off
# service in docker-compose.yml, which runs `prisma migrate deploy` +
# `npm run db:seed` — the seed script reads `content/**/*.json` (the
# scraper's output, bind-mounted at runtime for that service) to populate
# Postgres. The `web` image below doesn't need content/ at all: pages are
# read from Postgres at request time, not prerendered from JSON.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime --------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
