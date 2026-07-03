#!/usr/bin/env bash
# Sync checkout to production directory (never overwrites .env).
#
# Usage:
#   ./deploy/sync-to-prod.sh
#   SOURCE_DIR=/path/to/repo PROD_DIR=/var/docker/smart-accesscontrol ./deploy/sync-to-prod.sh
#   REMOTE=ping@host ./deploy/sync-to-prod.sh   # rsync over SSH (deploy-remote)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-$ROOT}"
PROD_DIR="${PROD_DIR:-/var/docker/smart-accesscontrol}"
REMOTE="${REMOTE:-}"

RSYNC_EXCLUDES=(
  --exclude node_modules
  --exclude .next
  --exclude backend/venv
  --exclude .git
  --exclude '.env'
  --exclude '.env.*'
  --exclude deploy_pack.tar.gz
)

if [[ -n "$REMOTE" ]]; then
  echo "Syncing $SOURCE_DIR → $REMOTE:$PROD_DIR ..."
  rsync -avz --delete "${RSYNC_EXCLUDES[@]}" \
    "$SOURCE_DIR/" "$REMOTE:$PROD_DIR/"
else
  echo "Syncing $SOURCE_DIR → $PROD_DIR ..."
  mkdir -p "$PROD_DIR"
  rsync -av --delete "${RSYNC_EXCLUDES[@]}" \
    "$SOURCE_DIR/" "$PROD_DIR/"
fi

echo "Sync complete."
