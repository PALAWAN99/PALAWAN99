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

chmod +x "$ROOT/deploy/sync-to-prod.sh" "$ROOT/deploy/deploy-on-server.sh"
REMOTE="$REMOTE" PROD_DIR="$REMOTE_DIR" bash "$ROOT/deploy/sync-to-prod.sh"

echo "Remote: deploy on server..."
ssh "$REMOTE" "PROD_DIR='$REMOTE_DIR' SKIP_EXTENSION_PACK=1 bash '$REMOTE_DIR/deploy/deploy-on-server.sh'"
