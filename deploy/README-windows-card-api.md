# Windows card reader API (DE-620)

Production admin runs at `https://lib.kku.ac.th/smart-access`. The **FastAPI card reader** must run on the **Windows PC** that has the USB reader — not on the Linux server.

## DE-620 driver (required on Windows)

Card API running (`127.0.0.1:8000/api/readers` → `{"readers":[]}`) **does not mean** the reader is detected.

Install **one** of:

1. **DUALi official driver** — `InstallDriver64bit_Sign.msi` (from DUALi SDK / reader CD). Enables PC/SC; restart KKU Card API after install.
2. **WinUSB via Zadig** — https://zadig.akeo.ie/ → Options → List All Devices → DUALi DE-620 → Replace Driver with **WinUSB**. Required for USB vendor protocol (pyusb).

Then open `http://127.0.0.1:8000/api/diagnostic` — should show `usb_detected: true` and readers in `/api/readers`.

## Setup

1. Install **Python 3.12** and DUALi DE-620 drivers.
2. From repo root: `python -m venv backend\venv` then `backend\venv\Scripts\pip install -r backend\requirements.txt`
3. Copy `.env.example` to `.env` at repo root and set at least:

   ```env
   CARD_API_PORT=8000
   CORS_ORIGINS=https://lib.kku.ac.th,http://localhost:3000
   ROUTE_LOG_INGEST_URL=https://lib.kku.ac.th/smart-access/api/logs/route
   ROUTE_LOG_INGEST_SECRET=<same as server>
   ```

4. Run: `.\deploy\run-card-api-windows.ps1`  
   If port 8000 is busy, the script picks the next free port.

5. In the browser: **Admin → อ่านบัตรประชาชน → Settings** — set **Card API URL** to `http://127.0.0.1:<PORT>` (must match the script output).

## Firewall

Bind to `127.0.0.1` only (default in script). Do not expose the card API to the LAN unless required.

## HTTPS → localhost

Chrome/Edge usually allow `https://lib.kku.ac.th` → `http://127.0.0.1`. If blocked, use the port shown in Settings and test in Edge; adjust enterprise policy if needed.
