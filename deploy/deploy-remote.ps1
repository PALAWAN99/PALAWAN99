# deploy/deploy-remote.ps1 - Sync repo to production host and rebuild containers.
#
# Usage:
#   .\deploy\deploy-remote.ps1
#   .\deploy\deploy-remote.ps1 -Push
#   .\deploy\deploy-remote.ps1 -Push -CommitMsg "fix: อ่านบัตร DE-620 retry"
#
param(
    [switch]$Push,
    [string]$CommitMsg = ""
)

$ErrorActionPreference = "Stop"

# Resolve directories
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = (Get-Item (Join-Path $ScriptDir "..")).FullName

# Configuration
$REMOTE = $env:REMOTE
if (-not $REMOTE) { $REMOTE = "ping@10.101.118.149" }
$REMOTE_DIR = $env:REMOTE_DIR
if (-not $REMOTE_DIR) { $REMOTE_DIR = "/var/docker/smart-accesscontrol" }

function Show-Usage {
    Write-Host "Usage:"
    Write-Host "  .\deploy\deploy-remote.ps1"
    Write-Host "  .\deploy\deploy-remote.ps1 -Push"
    Write-Host "  .\deploy\deploy-remote.ps1 -Push -CommitMsg `"your commit message`""
}

# 1. Git operations if -Push is active
if ($Push) {
    Write-Host "Checking git status..."
    $insideGit = git -C $Root rev-parse --is-inside-work-tree 2>$null
    if ($insideGit -ne "true") {
        Write-Warning "Not a git repository — skip git push"
    } else {
        $branch = (git -C $Root rev-parse --abbrev-ref HEAD).Trim()
        if ($branch -eq "HEAD") {
            Write-Error "Detached HEAD — checkout a branch before running with -Push"
            exit 1
        }

        Write-Host "Git: stage changes (excluding .env*) ..."
        git -C $Root add -A

        # Filter staged .env files and unstage them
        $stagedFiles = git -C $Root diff --cached --name-only
        foreach ($f in $stagedFiles) {
            if ($f -match '(^|/)\.env(\.|$)?') {
                git -C $Root reset HEAD -- $f 2>$null
            }
        }

        # Check if there are staged changes left
        git -C $Root diff --cached --quiet
        if ($LASTEXITCODE -ne 0) {
            $msg = $CommitMsg
            if (-not $msg) { $msg = "deploy: production sync $((Get-Date).ToString('yyyy-MM-dd'))" }
            Write-Host "Git: commit on $branch — $msg"
            git -C $Root commit -m $msg
        } else {
            Write-Host "Git: no staged changes to commit"
        }

        Write-Host "Git: push origin/$branch ..."
        git -C $Root push -u origin $branch
    }
}

# 2. Pack extension + desktop agent
Write-Host "`nPack extension + desktop agent for /downloads/ ..."
Set-Location (Join-Path $Root "frontend")
npm run extension:pack
Set-Location $Root

# 3. Pack and Upload to Server
Write-Host "`nrsync not available natively on Windows. Syncing using tar + scp sync..."
$TarFile = "deploy_pack.tar.gz"

Write-Host "Packing files locally into $TarFile..."
# Exclude standard directories
# Windows tar natively supports --exclude
& tar --exclude="node_modules" `
      --exclude=".next" `
      --exclude="backend/venv" `
      --exclude=".git" `
      --exclude=".env" `
      -czf $TarFile -C $Root .

Write-Host "Uploading archive to remote $REMOTE..."
& scp $TarFile "${REMOTE}:${REMOTE_DIR}/"

Write-Host "Extracting archive on remote..."
$ExtractCmd = "cd $REMOTE_DIR && tar -xzf $TarFile && rm $TarFile"
& ssh $REMOTE $ExtractCmd

Write-Host "Cleaning up local archive..."
if (Test-Path $TarFile) {
    Remove-Item $TarFile -Force
}

# 4. Remote: pick ports, build, up...
Write-Host "`nRemote: pick ports, build, up..."

$RemoteScript = @(
    "cd $REMOTE_DIR && chmod +x deploy/pick-host-port.sh deploy/sync-nginx-card-api.sh && ./deploy/pick-host-port.sh &&",
    "grep -q '^CARD_API_ON_SERVER=' .env 2>/dev/null || echo 'CARD_API_ON_SERVER=true' >> .env &&",
    "grep -q '^NEXT_PUBLIC_CARD_API_PROXY=' .env 2>/dev/null || echo 'NEXT_PUBLIC_CARD_API_PROXY=true' >> .env &&",
    "sed -i.bak 's|^NEXT_PUBLIC_API_URL=http://localhost:8000|# NEXT_PUBLIC_API_URL=|' .env 2>/dev/null || true &&",
    "sed -i.bak 's|^NEXT_PUBLIC_API_URL=http://127.0.0.1:8000|# NEXT_PUBLIC_API_URL=|' .env 2>/dev/null || true &&",
    "set -a && source .env && set +a &&",
    "PROFILES='' &&",
    "if [ \"`${CARD_API_ON_SERVER:-true}\" = 'true' ]; then PROFILES='--profile card-api-server'; fi &&",
    "docker compose -f deploy/docker-compose.prod.yml `$PROFILES up -d --build || {",
    "  echo 'Full stack build failed — retrying frontend only...';",
    "  docker compose -f deploy/docker-compose.prod.yml up -d --build frontend;",
    "} &&",
    "if [ \"`${CARD_API_ON_SERVER:-true}\" = 'true' ]; then ./deploy/sync-nginx-card-api.sh --env-file .env || echo 'WARN: nginx card-api sync failed — fix proxy_pass manually'; fi"
) -join "`n"

& ssh $REMOTE $RemoteScript

# 5. Remote: health check
Write-Host "`nHealth (on server):"

$HealthScript = @(
    "set -a; source $REMOTE_DIR/.env; set +a;",
    "PORT=`${FRONTEND_HOST_PORT:-13010}; BPORT=`${BACKEND_HOST_PORT:-8004};",
    "echo '--- Next.js';",
    "curl -fsS \"http://127.0.0.1:`${PORT}/smart-access/api/health\" || true; echo;",
    "echo '--- Card API (host)';",
    "curl -fsS \"http://127.0.0.1:`${BPORT}/api/readers\" 2>/dev/null | head -c 200 || echo 'backend not reachable on host port'; echo;",
    "echo '--- Card API (via public nginx)';",
    "curl -fsS \"https://lib.kku.ac.th/smart-access/card-api/api/readers\" 2>/dev/null | head -c 200 || echo 'nginx /smart-access/card-api/ missing or backend down — add deploy/nginx-lib-kku-smart-access.conf block and reload nginx'"
) -join "`n"

& ssh $REMOTE $HealthScript

Write-Host "`nDeployment completed successfully!"
