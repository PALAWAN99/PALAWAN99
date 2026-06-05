#!/usr/bin/env bash
# Sync repo to production host and rebuild containers.
#
# Usage:
#   ./deploy/deploy-remote.sh
#   ./deploy/deploy-remote.sh --push "fix: อ่านบัตร DE-620 retry"
#   GIT_PUSH=1 COMMIT_MSG="fix: ..." ./deploy/deploy-remote.sh
#
# Git (optional): --push or GIT_PUSH=1 stages all changes except .env*, commits if needed,
# then pushes the current branch to origin. Never force-pushes.
set -euo pipefail

REMOTE="${REMOTE:-ping@10.101.118.149}"
REMOTE_DIR="${REMOTE_DIR:-/var/docker/smart-accesscontrol}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

GIT_PUSH="${GIT_PUSH:-0}"
COMMIT_MSG="${COMMIT_MSG:-}"

usage() {
  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --push)
      GIT_PUSH=1
      shift
      if [[ $# -gt 0 && "$1" != --* ]]; then
        COMMIT_MSG="$1"
        shift
      fi
      ;;
    --no-push|--skip-git)
      GIT_PUSH=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

git_push_to_origin() {
  if ! git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "WARN: not a git repository — skip git push"
    return 0
  fi

  local msg="${COMMIT_MSG:-deploy: production sync $(date +%Y-%m-%d)}"
  local branch

  cd "$ROOT"
  branch="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$branch" == "HEAD" ]]; then
    echo "ERROR: detached HEAD — checkout a branch before --push" >&2
    exit 1
  fi

  echo "Git: stage changes (excluding .env*) ..."
  git add -A
  # Never commit secrets
  while IFS= read -r envfile; do
    [[ -n "$envfile" ]] && git reset HEAD -- "$envfile" 2>/dev/null || true
  done < <(git diff --cached --name-only | grep -E '(^|/)\.env(\.|$)?' || true)

  if ! git diff --cached --quiet; then
    echo "Git: commit on $branch — $msg"
    git commit -m "$msg"
  else
    echo "Git: no staged changes to commit"
  fi

  echo "Git: push origin/$branch ..."
  git push -u origin "$branch"
}

if [[ "$GIT_PUSH" == "1" ]]; then
  git_push_to_origin
fi

echo "Pack extension + desktop agent for /downloads/ ..."
(cd "$ROOT/frontend" && npm run extension:pack)

if command -v rsync >/dev/null 2>&1; then
  echo "Syncing via rsync..."
  rsync -avz --delete \
    --exclude node_modules \
    --exclude .next \
    --exclude backend/venv \
    --exclude .git \
    --exclude '.env' \
    "$ROOT/" "$REMOTE:$REMOTE_DIR/"
else
  echo "rsync not found. Falling back to tar + scp sync (highly compatible with Windows/Git Bash)..."
  TAR_FILE="deploy_pack.tar.gz"
  
  echo "Packing files locally..."
  tar --exclude="node_modules" \
      --exclude=".next" \
      --exclude="backend/venv" \
      --exclude=".git" \
      --exclude=".env" \
      -czf "$TAR_FILE" -C "$ROOT" .
  
  echo "Uploading archive to remote..."
  scp "$TAR_FILE" "$REMOTE:$REMOTE_DIR/"
  
  echo "Extracting archive on remote..."
  ssh "$REMOTE" "cd $REMOTE_DIR && tar -xzf $TAR_FILE && rm $TAR_FILE"
  
  echo "Cleaning up local archive..."
  rm -f "$TAR_FILE"
fi

echo "Remote: pick ports, build, up..."
# shellcheck source=/dev/null
ssh "$REMOTE" "cd $REMOTE_DIR && chmod +x deploy/pick-host-port.sh deploy/sync-nginx-card-api.sh && ./deploy/pick-host-port.sh && \
  grep -q '^CARD_API_ON_SERVER=' .env 2>/dev/null || echo 'CARD_API_ON_SERVER=true' >> .env && \
  grep -q '^NEXT_PUBLIC_CARD_API_PROXY=' .env 2>/dev/null || echo 'NEXT_PUBLIC_CARD_API_PROXY=true' >> .env && \
  sed -i.bak 's|^NEXT_PUBLIC_API_URL=http://localhost:8000|# NEXT_PUBLIC_API_URL=|' .env 2>/dev/null || true && \
  sed -i.bak 's|^NEXT_PUBLIC_API_URL=http://127.0.0.1:8000|# NEXT_PUBLIC_API_URL=|' .env 2>/dev/null || true && \
  set -a && source .env && set +a && \
  PROFILES='' && \
  if [ \"\${CARD_API_ON_SERVER:-true}\" = 'true' ]; then PROFILES='--profile card-api-server'; fi && \
  docker compose -f deploy/docker-compose.prod.yml \$PROFILES up -d --build || { \
    echo 'Full stack build failed — retrying frontend only...'; \
    docker compose -f deploy/docker-compose.prod.yml up -d --build frontend; \
  } && \
  if [ \"\${CARD_API_ON_SERVER:-true}\" = 'true' ]; then ./deploy/sync-nginx-card-api.sh --env-file .env || echo 'WARN: nginx card-api sync failed — fix proxy_pass manually'; fi"

echo "Health (on server):"
ssh "$REMOTE" "set -a; source ${REMOTE_DIR}/.env; set +a; \
  PORT=\${FRONTEND_HOST_PORT:-13010}; BPORT=\${BACKEND_HOST_PORT:-8004}; \
  echo '--- Next.js'; \
  curl -fsS \"http://127.0.0.1:\${PORT}/smart-access/api/health\" || true; echo; \
  echo '--- Card API (host)'; \
  curl -fsS \"http://127.0.0.1:\${BPORT}/api/readers\" 2>/dev/null | head -c 200 || echo 'backend not reachable on host port'; echo; \
  echo '--- Card API (via public nginx)'; \
  curl -fsS \"https://lib.kku.ac.th/smart-access/card-api/api/readers\" 2>/dev/null | head -c 200 || echo 'nginx /smart-access/card-api/ missing or backend down — add deploy/nginx-lib-kku-smart-access.conf block and reload nginx'"
