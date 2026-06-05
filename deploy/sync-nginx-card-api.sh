#!/usr/bin/env bash
# Patch lib.kku.ac.th nginx card-api upstream to match BACKEND_HOST_PORT in .env, then reload.
# Usage: ./deploy/sync-nginx-card-api.sh [--env-file /path/to/.env]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"
NGINX_CONF="${NGINX_CONF:-/home/admin/lib/nginx/default.conf}"
NGINX_CONTAINER="${NGINX_CONTAINER:-lib-nginx-1}"
HOST_IP="${HOST_IP:-10.101.118.149}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      ENV_FILE="${2:?missing path after --env-file}"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi
if [[ ! -f "$NGINX_CONF" ]]; then
  echo "Missing nginx config: $NGINX_CONF" >&2
  exit 1
fi

# shellcheck source=/dev/null
set -a
source "$ENV_FILE"
set +a

BPORT="${BACKEND_HOST_PORT:-8004}"
CARD_API_ON_SERVER="${CARD_API_ON_SERVER:-true}"
if [[ "$CARD_API_ON_SERVER" != "true" ]]; then
  echo "CARD_API_ON_SERVER is not true — skip nginx card-api sync"
  exit 0
fi

TARGET="http://${HOST_IP}:${BPORT}/"
if ! grep -q 'location \^~ /smart-access/card-api/' "$NGINX_CONF"; then
  echo "No /smart-access/card-api/ block in $NGINX_CONF — append from deploy/nginx-lib-kku-smart-access.conf" >&2
  exit 1
fi

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
sed -E "s|([[:space:]]*proxy_pass )http://${HOST_IP}:[0-9]+/;|\1${TARGET};|" "$NGINX_CONF" >"$TMP"
cp "$TMP" "$NGINX_CONF"

echo "nginx card-api upstream -> ${TARGET}"

if docker ps --format '{{.Names}}' | grep -qx "$NGINX_CONTAINER"; then
  docker exec "$NGINX_CONTAINER" nginx -t
  docker exec "$NGINX_CONTAINER" nginx -s reload
  echo "Reloaded $NGINX_CONTAINER"
else
  echo "Container $NGINX_CONTAINER not running — reload nginx manually" >&2
  exit 1
fi
