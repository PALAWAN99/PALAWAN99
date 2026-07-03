#!/usr/bin/env bash
# Build and restart production containers on the host (run after sync-to-prod).
#
# Usage:
#   ./deploy/deploy-on-server.sh
#   SKIP_EXTENSION_PACK=1 ./deploy/deploy-on-server.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROD_DIR="${PROD_DIR:-$ROOT}"
cd "$PROD_DIR"

if [[ "${SKIP_EXTENSION_PACK:-0}" != "1" ]]; then
  echo "Pack extension + desktop agent for /downloads/ ..."
  if [[ ! -d frontend/node_modules ]]; then
    echo "Installing frontend dependencies for extension pack ..."
    (cd frontend && npm ci)
  fi
  (cd frontend && npm run extension:pack)
else
  echo "SKIP_EXTENSION_PACK=1 — using downloads from sync"
fi

chmod +x deploy/pick-host-port.sh deploy/sync-nginx-card-api.sh deploy/sync-nginx-go-api.sh
./deploy/pick-host-port.sh

grep -q '^CARD_API_ON_SERVER=' .env 2>/dev/null || echo 'CARD_API_ON_SERVER=true' >> .env
grep -q '^NEXT_PUBLIC_CARD_API_PROXY=' .env 2>/dev/null || echo 'NEXT_PUBLIC_CARD_API_PROXY=true' >> .env
sed -i.bak 's|^NEXT_PUBLIC_API_URL=http://localhost:8000|# NEXT_PUBLIC_API_URL=|' .env 2>/dev/null || true
sed -i.bak 's|^NEXT_PUBLIC_API_URL=http://127.0.0.1:8000|# NEXT_PUBLIC_API_URL=|' .env 2>/dev/null || true

echo "Loading .env (ignore invalid shell lines) ..."
set +e
set -a
# shellcheck source=/dev/null
source .env
set +a
set -e

PROFILES=''
if [[ "${CARD_API_ON_SERVER:-true}" == 'true' ]]; then
  PROFILES='--profile card-api-server'
fi

echo "Docker compose build/up (frontend + optional card-api) ..."
if ! docker compose -f deploy/docker-compose.prod.yml $PROFILES up -d --build; then
  echo 'Full stack build failed — retrying frontend only...'
  docker compose -f deploy/docker-compose.prod.yml up -d --build frontend
fi

if [[ "${CARD_API_ON_SERVER:-true}" == 'true' ]]; then
  ./deploy/sync-nginx-card-api.sh --env-file .env || echo 'WARN: nginx card-api sync failed'
fi

echo '--- Go API (business spike) ---'
docker compose -f deploy/docker-compose.go-api.yml up -d --build || echo 'WARN: go-api build/up failed'
./deploy/sync-nginx-go-api.sh --env-file .env || echo 'WARN: nginx go-api sync failed'

echo "Health checks:"
PORT="${FRONTEND_HOST_PORT:-13010}"
BPORT="${BACKEND_HOST_PORT:-8004}"
GOPORT="${GO_API_HOST_PORT:-8090}"

echo '--- Next.js'
curl -fsS "http://127.0.0.1:${PORT}/smart-access/api/health" || true
echo
echo '--- Card API (host)'
curl -fsS "http://127.0.0.1:${BPORT}/api/readers" 2>/dev/null | head -c 200 || echo 'backend not reachable on host port'
echo
echo '--- Card API (via public nginx)'
curl -fsS "https://lib.kku.ac.th/smart-access/card-api/api/readers" 2>/dev/null | head -c 200 || echo 'nginx /smart-access/card-api/ missing or backend down'
echo
echo '--- Go API (host)'
curl -fsS "http://127.0.0.1:${GOPORT}/api/health" || true
echo
echo '--- Go API (via public nginx)'
curl -fsS "https://lib.kku.ac.th/smart-access/api-go/health" 2>/dev/null | head -c 200 || echo 'nginx /smart-access/api-go/ missing or go-api down'
echo
echo "Deploy on server finished."
