# AGENTS.md — SmartCard-Reader-Member monorepo

Guidance for Cursor and other AI agents working in this repository.

## Project overview

Monorepo for **KKU Library** smart access:

- **QR Gate Access Control** (Next.js admin, Prisma/PostgreSQL) — `frontend/`
- **Thai national ID card reader** (DUALi DE-620) via **Python FastAPI** — `backend/`

GitHub: [Panuwath/qrcode-accesscontrol](https://github.com/Panuwath/qrcode-accesscontrol)

## Repository layout

```text
SmartCard-Reader-Member/
├── AGENTS.md          ← this file
├── README.md          ← human setup guide
├── backend/           ← FastAPI, pyscard, port 8000
│   ├── main.py
│   ├── run-dev.sh     ← prefer: python3.12 -m uvicorn (venv shebang may be stale)
│   └── venv/          ← do not commit
└── frontend/          ← Next.js 16 (package name: e-ticket-qrcode)
    ├── prisma/        ← PostgreSQL schema (QR gate)
    └── src/
        ├── app/       ← App Router
        └── components/
            ├── layout/AdminShell.tsx
            └── smartcard/SmartCardReaderPage.tsx
```

Do not edit `qrcode-accesscontrol/` if it still exists — it was merged into `frontend/`.

## Frontend routes

| Path | Purpose |
| --- | --- |
| `/` | QR Gate landing (Mantine) |
| `/admin` | Admin dashboard |
| `/admin/infrastructure` | Branches, gates, devices (one page, Mantine tabs; query `tab`: `branches`, `gates`, or `devices`) |
| `/admin/branches`, `/admin/gates`, `/admin/devices` | Redirect to infrastructure hub with the matching tab |
| `/admin/idcard` | Thai ID card reader (`SmartCardReaderPage`, embedded) |
| `/admin/changelog` | Release notes (DB-backed, search + pagination) |
| `/api/health` | DB health (Prisma) |

## Development commands

**Backend (card reader API):**

```bash
cd backend
./run-dev.sh
# or: ./venv/bin/python3.12 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

```bash
cd frontend
npm install          # runs prisma generate via postinstall
npm run dev          # http://localhost:3000
```

**Environment (single file at repo root `.env`):**

Copy from `.env.example`: `cp .env.example .env`

- `NEXT_PUBLIC_API_URL=http://localhost:8000` — Python backend
- `DATABASE_URL=...` — PostgreSQL for Prisma (required for `/api/health` at runtime)
- Next.js loads root `.env` via `loadEnvConfig` in `frontend/next.config.ts`
- Prisma/scripts use `frontend/load-root-env.ts`; backend loads root `.env` in `main.py`
- Do not use `frontend/.env.local` — removed in favor of monorepo root `.env`

## Changelog (required for feature work)

After adding or changing user-visible behavior, record an entry for **`/admin/changelog`**:

```bash
cd frontend
npm run changelog:add -- \
  --title "สั้น ภาษาไทย" \
  --description "รายละเอียดการเปลี่ยนแปลง" \
  --type FEATURE
```

Types: `FEATURE` | `FIX` | `IMPROVEMENT` | `SECURITY` | `OTHER`. By default `changelog:add` **bumps the patch** in `frontend/src/lib/app-meta.ts` and records the changelog under the new version; use `--no-bump` to keep the current file version, or `--version X.Y.Z` to pin the DB row without editing `app-meta.ts`. See `.cursor/rules/changelog.mdc`.

**อัตโนมัติจาก git (หลัง commit):** รัน `npm run changelog:auto` ใน `frontend/` — อ่าน commit ล่าสุด แปลงประเภทจาก conventional commit (`feat:`, `fix:` ฯลฯ) แล้วสร้างแถวใน DB (ไม่ซ้ำถ้ามี marker ของ commit เดิมแล้ว) ต้องมี `DATABASE_URL` ในราก `.env` ติดตั้ง hook ครั้งเดียว: `./scripts/install-git-hooks.sh` (ตั้ง `core.hooksPath=.githooks`)

**ปล่อย release (เลขเวอร์ชัน + changelog ตรงกัน):** จาก `frontend/`:

```bash
npm run release:version -- \
  --description "สรุปการเปลี่ยนแปลงหลักของรอบนี้ (ไทย)"
```

ไม่ระบุ `--version` จะ **เพิ่มแพตช์อัตโนมัติ** จาก `APP_VERSION` ปัจจุบัน หรือส่ง `--version 1.1.0` เมื่อต้องการกำหนด minor/major เอง

สคริปต์จะอัปเดต `src/lib/app-meta.ts` (`APP_VERSION`) และสร้างแถว changelog ด้วยเลขเดียวกัน (ถ้าบันทึก DB ไม่สำเร็จ จะคืนไฟล์ `app-meta.ts` เป็นเวอร์ชันเดิม) ทางเลือก: `--title`, `--type`

## Code conventions

- **Smart card UI:** change `frontend/src/components/smartcard/SmartCardReaderPage.tsx` and `frontend/src/app/admin/idcard/page.tsx`. UI shell uses Mantine; reader controls use shadcn/ui.
- **Card API client:** `frontend/src/lib/api.ts` only — no Python in `frontend/`.
- **Root layout:** `frontend/src/app/layout.tsx` — Mantine provider + hydration fix for browser extensions (`cz-shortcut-listen`).
- **Never commit:** `backend/venv/`, `**/node_modules/`, `**/.next/`, `.env*`, secrets.
- **Focused diffs:** match existing patterns; avoid drive-by refactors.

## Deploy / CI

- Vercel (or similar): set **Root Directory** to `frontend/`.
- Run `npx prisma generate` before `next build` if postinstall is skipped.

### Production (lib.kku.ac.th)

| Mode | Next.js | Card API (FastAPI) on counter PC |
| --- | --- | --- |
| **Chrome Extension** (default) | Linux server Docker | `extension/` + Native Host — Bridge in popup; see easy-install zip |
| **Desktop agent** (optional) | Same | `desktop-agent/` → `.dmg` (Mac) / `.zip` (Windows); set Card API URL to `http://127.0.0.1:8000` in reader settings — no Chrome required |
| **Server USB** | Same + `backend` in compose + nginx `/smart-access/card-api/` | Reader on Linux server only |
| **Windows script** | Same | `deploy/run-card-api-windows.ps1` |

- Public URL: `https://lib.kku.ac.th/smart-access` — set `NEXT_PUBLIC_BASE_PATH=/smart-access`, `AUTH_URL` / `NEXTAUTH_URL` with same prefix.
- Server path: `/var/docker/smart-accesscontrol/` — root `.env` (upload via SFTP/rsync, `chmod 600`) **before** `docker compose build`.
- Ports: `./deploy/pick-host-port.sh` → `FRONTEND_HOST_PORT`, `BACKEND_HOST_PORT` (if 8000 busy, uses 8001+).
- Nginx snippet: `deploy/nginx-lib-kku-smart-access.conf` (replace `<FRONTEND_HOST_PORT>`).
- Windows guide: `deploy/README-windows-card-api.md`.
- Id card settings: runtime **Card API URL** in `localStorage` (`frontend/src/lib/card-api-base.ts`).

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
