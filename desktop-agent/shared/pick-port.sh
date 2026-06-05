#!/usr/bin/env bash
# Pick first free TCP port in CARD_API_PORT or 8000–8010.
set -euo pipefail

start="${CARD_API_PORT:-8000}"
for p in "$start" 8000 8001 8002 8003 8010 18080; do
  if ! lsof -iTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "$p"
    exit 0
  fi
done
echo "$start"
