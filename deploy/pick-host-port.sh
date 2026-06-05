#!/usr/bin/env bash
# Pick free TCP ports on the deploy host and update .env (FRONTEND_HOST_PORT, BACKEND_HOST_PORT).
# Usage: ./deploy/pick-host-port.sh [--env-file /path/to/.env]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"
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

port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -tln 2>/dev/null | grep -q ":${port} "
    return $?
  fi
  if command -v netstat >/dev/null 2>&1; then
    netstat -tln 2>/dev/null | grep -q ":${port} "
    return $?
  fi
  return 1
}

pick_port() {
  local prefer="$1"
  shift
  local candidates=("$prefer" "$@")
  local p
  for p in "${candidates[@]}"; do
    if ! port_in_use "$p"; then
      echo "$p"
      return 0
    fi
  done
  echo "ERROR: no free port in candidates: ${candidates[*]}" >&2
  return 1
}

set_env_var() {
  local key="$1"
  local val="$2"
  if [[ ! -f "$ENV_FILE" ]]; then
  touch "$ENV_FILE"
  fi
  if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
    if [[ "$(uname)" == Darwin ]]; then
      sed -i '' "s|^${key}=.*|${key}=${val}|" "$ENV_FILE"
    else
      sed -i "s|^${key}=.*|${key}=${val}|" "$ENV_FILE"
    fi
  else
    echo "${key}=${val}" >>"$ENV_FILE"
  fi
}

# Never use host :3000 — many Next.js containers already map *:3000 internally.
# Keep FRONTEND_HOST_PORT from .env when set (nginx upstream must stay stable across deploys).
FRONTEND_PORT=""
if [[ -f "$ENV_FILE" ]]; then
  FRONTEND_PORT="$(grep -E '^FRONTEND_HOST_PORT=' "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- || true)"
fi
if [[ -z "$FRONTEND_PORT" ]]; then
  FRONTEND_PORT="$(pick_port 13010 13011 13012 13013 13014 13015)"
fi

# Keep BACKEND_HOST_PORT stable — nginx card-api upstream must match across deploys.
BACKEND_PORT=""
if [[ -f "$ENV_FILE" ]]; then
  BACKEND_PORT="$(grep -E '^BACKEND_HOST_PORT=' "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- || true)"
fi
if [[ -z "$BACKEND_PORT" ]]; then
  BACKEND_PORT="$(pick_port 8004 8001 8002 8003 8005 8010 18080 18081)"
fi

set_env_var FRONTEND_HOST_PORT "$FRONTEND_PORT"
set_env_var BACKEND_HOST_PORT "$BACKEND_PORT"

echo "Updated $ENV_FILE:"
echo "  FRONTEND_HOST_PORT=$FRONTEND_PORT"
echo "  BACKEND_HOST_PORT=$BACKEND_PORT"
