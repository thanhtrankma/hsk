#!/usr/bin/env bash
# Stops the local dev Postgres container (data is kept in the pgdata volume;
# nothing is deleted). Pass --colima to also stop the colima VM itself.
#
# Usage: ./scripts/dev-down.sh [--colima]
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "==> Stopping Postgres (docker compose stop db)..."
docker compose stop db

if [ "${1:-}" = "--colima" ] && command -v colima >/dev/null 2>&1; then
  echo "==> Stopping colima..."
  colima stop
fi

echo "==> Done. Data is preserved (docker volume: hsk_pgdata)."
