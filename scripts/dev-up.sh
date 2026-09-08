#!/usr/bin/env bash
# Quick local dev startup: brings up the Docker/colima engine + Postgres,
# then tells you what to run next. Safe to re-run any time.
#
# Usage: ./scripts/dev-up.sh
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

if command -v colima >/dev/null 2>&1; then
  if ! colima status >/dev/null 2>&1; then
    echo "==> Starting colima (Docker engine)..."
    colima start
  else
    echo "==> colima already running."
  fi
elif ! docker info >/dev/null 2>&1; then
  echo "!! Docker doesn't seem to be running and colima isn't installed." >&2
  echo "!! Start Docker Desktop (or install colima) and try again." >&2
  exit 1
fi

echo "==> Starting Postgres (docker compose up -d db)..."
docker compose up -d db

echo "==> Waiting for Postgres to become healthy..."
for _ in $(seq 1 30); do
  health="$(docker inspect --format='{{.State.Health.Status}}' hsk-db-1 2>/dev/null || true)"
  if [ "$health" = "healthy" ]; then
    echo "==> Postgres is healthy."
    break
  fi
  sleep 1
done
if [ "$health" != "healthy" ]; then
  echo "!! Postgres did not become healthy in time - check: docker compose logs db" >&2
  exit 1
fi

cat <<'EOF'

Ready. Next:
  cd web && npm run dev        # http://localhost:3000

First time only (schema + import scraped content/sample users):
  cd web && npx prisma migrate deploy && npm run db:seed

To stop everything later: ./scripts/dev-down.sh
EOF
