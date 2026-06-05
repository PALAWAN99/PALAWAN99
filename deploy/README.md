# Deploy Smart Access (lib.kku.ac.th)

Production URL: `https://lib.kku.ac.th/smart-access`

Server: `ping@10.101.118.149` → `/var/docker/smart-accesscontrol/`

## 1. Prepare `.env` on server

Copy `deploy/.env.production.example` to repo root `.env`, fill secrets, upload via SFTP/rsync/scp:

```bash
chmod 600 /var/docker/smart-accesscontrol/.env
```

Required: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_BASE_PATH=/smart-access`, `QR_SECRET`, route log secrets/URL.

Upload **before** `docker compose build`.

## 2. Pick host ports

```bash
cd /var/docker/smart-accesscontrol
chmod +x deploy/pick-host-port.sh
./deploy/pick-host-port.sh
```

Updates `FRONTEND_HOST_PORT` and `BACKEND_HOST_PORT` in `.env`.

**Do not bind host port 3000** — other Next.js stacks on this server already use it. The script picks **13010+** for the frontend (container internal port stays 3000). Publish with `0.0.0.0:PORT` so `lib-nginx-1` can proxy via `10.101.118.149:PORT` (not `127.0.0.1` only).

**Do not run** root `docker-compose.yml` (`3000:3000`) on this host — use `deploy/docker-compose.prod.yml` only.

## 3. Build and run

```bash
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

## 4. Database

From server (Node.js on host) or dev machine with prod `DATABASE_URL`:

```bash
cd frontend
set -a && source ../.env && set +a
npx prisma db push
npm run seed:admin
```

## 5. Nginx

Edit `deploy/nginx-lib-kku-smart-access.conf` — replace `<FRONTEND_HOST_PORT>` with value from `.env`, include in `lib.kku.ac.th` server block, then `nginx -t && nginx -s reload`.

### Card API on Linux server (USB on `10.101.118.149`)

In server `.env`:

```bash
CARD_API_ON_SERVER=true
NEXT_PUBLIC_CARD_API_PROXY=true
```

1. Uncomment / add `location ^~ /smart-access/card-api/` in `deploy/nginx-lib-kku-smart-access.conf` (use `BACKEND_HOST_PORT` from `.env`), reload nginx.
2. `docker compose -f deploy/docker-compose.prod.yml --profile card-api-server up -d --build`  
   (`deploy-remote.sh` adds `--profile card-api-server` when `CARD_API_ON_SERVER=true`.)
3. Browser calls `https://lib.kku.ac.th/smart-access/card-api/...` (same origin — not `127.0.0.1`).

**Campus reverse proxy (`rev-proxy-c00`, `lib.kku.ac.th` → `10.101.109.132`):** must allow **WebSocket upgrade** for `/smart-access/card-api/ws/` *or* long-lived **SSE** for `/smart-access/card-api/api/card-events-stream`. The app falls back to SSE when WS returns 404. On `10.101.118.149`, run `./deploy/sync-nginx-card-api.sh` after each `BACKEND_HOST_PORT` change.

### Card API on Windows PC (counter)

```bash
CARD_API_ON_SERVER=false
NEXT_PUBLIC_CARD_API_PROXY=false
```

No nginx `card-api` block. Run `deploy/run-card-api-windows.ps1` on the PC with the reader.

## 6. Windows card reader (counter mode)

See `deploy/README-windows-card-api.md`.

## Remote sync from dev

**For Mac, Linux, and Windows (Git Bash):**

```bash
./deploy/deploy-remote.sh
```

With GitHub backup before deploy (commit if needed, push current branch — never force-push):

```bash
./deploy/deploy-remote.sh --push "fix: สรุปการเปลี่ยนแปลง"
# or
GIT_PUSH=1 COMMIT_MSG="fix: ..." ./deploy/deploy-remote.sh
```

**For Windows (PowerShell):**

```powershell
.\deploy\deploy-remote.ps1
```

With GitHub backup before deploy (commit if needed, push current branch):

```powershell
.\deploy\deploy-remote.ps1 -Push -CommitMsg "fix: สรุปการเปลี่ยนแปลง"
```

Does not upload `.env` — upload separately. `--push` (or `-Push`) also excludes `.env*` from commits.

**Note:** `frontend/deploy.sh` only pushes to GitHub; it does not sync or rebuild Docker. Use `deploy/deploy-remote.sh` or `deploy/deploy-remote.ps1` for production.
