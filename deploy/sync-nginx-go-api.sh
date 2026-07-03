#!/usr/bin/env bash
# Patch lib.kku.ac.th nginx go-api upstream to match GO_API_HOST_PORT in .env, then reload.
# Appends the /smart-access/api-go/ block from deploy/nginx-lib-kku-smart-access.conf if missing.
# Usage: ./deploy/sync-nginx-go-api.sh [--env-file /path/to/.env]
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

# Read only the port we need (avoids `source .env` which breaks on unquoted
# values — e.g. passwords containing shell metacharacters).
GPORT="$(grep -E '^GO_API_HOST_PORT=' "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- || true)"
GPORT="${GPORT:-8090}"
TARGET="http://${HOST_IP}:${GPORT}/"

if ! grep -q 'location.*smart-access/api-go/' "$NGINX_CONF"; then
  echo "No /smart-access/api-go/ block in $NGINX_CONF — inserting inside server block"
  # Build the location block with the actual port (avoids fragile awk extraction).
  BLOCK=$(cat <<EOF

    # smart-access Go API (business API) — added by sync-nginx-go-api.sh
    location ^~ /smart-access/api-go/ {
        proxy_pass http://${HOST_IP}:${GPORT}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }
EOF
)
  # Insert before the card-api block (known to be inside the server block).
  TMP="$(mktemp)"
  trap 'rm -f "$TMP"' EXIT
  if grep -q 'location.*smart-access/card-api/' "$NGINX_CONF"; then
    awk -v block="$BLOCK" '/location.*smart-access\/card-api\//{print block} {print}' "$NGINX_CONF" >"$TMP"
  elif grep -q 'location.*smart-access {' "$NGINX_CONF"; then
    awk -v block="$BLOCK" '/location.*smart-access \{/{print block} {print}' "$NGINX_CONF" >"$TMP"
  else
    echo "ERROR: cannot find insertion point (no /smart-access/ block in nginx config)" >&2
    exit 1
  fi
  cp "$TMP" "$NGINX_CONF"
else
  # Block already exists — just update the upstream port (handles /api/ path).
  TMP="$(mktemp)"
  trap 'rm -f "$TMP"' EXIT
  sed -E "s|http://${HOST_IP}:[0-9]+/api/|http://${HOST_IP}:${GPORT}/api/|" "$NGINX_CONF" >"$TMP"
  cp "$TMP" "$NGINX_CONF"
fi

echo "nginx go-api upstream -> ${TARGET}"

if docker ps --format '{{.Names}}' | grep -qx "$NGINX_CONTAINER"; then
  docker exec "$NGINX_CONTAINER" nginx -t
  docker exec "$NGINX_CONTAINER" nginx -s reload
  echo "Reloaded $NGINX_CONTAINER"
else
  echo "Container $NGINX_CONTAINER not running — reload nginx manually" >&2
  exit 1
fi
