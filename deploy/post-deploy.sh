#!/usr/bin/env bash
# Prisma migrate + admin seed (run on server with repo checkout and Node.js).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"
set -a
# shellcheck source=/dev/null
source "$ROOT/.env"
set +a
npx prisma db push
npm run seed:admin
echo "Done: prisma db push + seed:admin"
