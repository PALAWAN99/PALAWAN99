#!/usr/bin/env bash
# Register a self-hosted GitHub Actions runner for Smart Gate Access (repo-level).
#
# Run on production host (docker-lib01) as user ping:
#   GITHUB_PAT=ghp_... ./deploy/setup-github-runner.sh
#   RUNNER_TOKEN=... ./deploy/setup-github-runner.sh   # from registration-token API
#
# Or from dev machine:
#   gh api -X POST repos/Panuwath/qrcode-accesscontrol/actions/runners/registration-token -q .token | \
#     ssh ping@10.101.118.149 "RUNNER_TOKEN=$(cat) bash -s" < deploy/setup-github-runner.sh
set -euo pipefail

REPO="${GITHUB_REPO:-Panuwath/qrcode-accesscontrol}"
RUNNER_NAME="${RUNNER_NAME:-smart-access-prod}"
RUNNER_DIR="${RUNNER_DIR:-/home/ping/actions-runner-smart-access}"
RUNNER_VERSION="${RUNNER_VERSION:-2.325.0}"
RUNNER_LABELS="${RUNNER_LABELS:-self-hosted,linux,x64,smart-access-prod}"

if [[ -z "${RUNNER_TOKEN:-}" ]]; then
  if [[ -n "${GITHUB_PAT:-}" ]]; then
    RUNNER_TOKEN="$(curl -fsSL -X POST \
      -H "Authorization: Bearer ${GITHUB_PAT}" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${REPO}/actions/runners/registration-token" \
      | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
  fi
fi

if [[ -z "${RUNNER_TOKEN:-}" ]]; then
  echo "ERROR: set RUNNER_TOKEN or GITHUB_PAT" >&2
  exit 1
fi

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [[ ! -f ./config.sh ]]; then
  echo "Downloading actions-runner v${RUNNER_VERSION} ..."
  curl -fsSL -o actions-runner.tar.gz \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  tar xzf actions-runner.tar.gz
  rm -f actions-runner.tar.gz
fi

if [[ -f ./.runner ]]; then
  echo "Runner already configured in $RUNNER_DIR — reinstall service only"
else
  ./config.sh \
    --url "https://github.com/${REPO}" \
    --token "$RUNNER_TOKEN" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --unattended \
    --replace
fi

if [[ ! -f ./.service ]]; then
  if ./svc.sh install 2>/dev/null; then
    ./svc.sh start
  else
    echo "WARN: svc.sh needs sudo — starting runner in background (use systemd/sudo for persistence)"
    nohup ./run.sh >> _diag/runner.nohup.log 2>&1 &
    sleep 2
  fi
else
  ./svc.sh start || nohup ./run.sh >> _diag/runner.nohup.log 2>&1 &
fi
./svc.sh status 2>/dev/null || true

echo "Runner ready: $RUNNER_NAME ($RUNNER_LABELS) in $RUNNER_DIR"
