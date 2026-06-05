# KKU Card API — Desktop Agent

**Supplement** to the Chrome Card Bridge extension — same `backend/` Card API,
packaged as a local app so counters can skip Chrome Extension if they prefer.

The **Chrome Extension + Native Host** flow is unchanged and remains the
recommended default.

## Platform builds

| Platform | Artifact | How to build |
| --- | --- | --- |
| **macOS** | `kku-card-api-mac.dmg` | `./mac/build-dmg.sh` (Mac, Python 3.12+) |
| **Windows** | `kku-card-api-windows.zip` | `.\windows\build-portable.ps1` |
| **Windows** | `kku-card-api-setup.exe` | Inno Setup: `KKU-Card-API.iss` |

## Branding (Mac + Windows)

| Platform | Icon file | Where it shows |
| --- | --- | --- |
| **macOS** | `AppIcon.icns` | `KKU Card API.app`, `.dmg` window |
| **Windows** | `app-icon.ico` | `kku-card-api-setup.exe`, shortcuts |

Shared sources: `desktop-agent/assets/app-icon.svg` (+ rendered PNG/ICO).

## macOS (icon + installer art)

Source files live in `desktop-agent/assets/`:

- `app-icon.svg` → `AppIcon.icns` (Dock / Finder icon for `KKU Card API.app`)
- `dmg-background.svg` → background image when opening the `.dmg`

After editing SVGs, on a Mac run:

```bash
bash desktop-agent/mac/render-asset.sh   # PNG + .icns
bash desktop-agent/mac/build-dmg.sh      # full .app + .dmg
```

`brew install librsvg` gives the sharpest PNG export. Committed
`app-icon-1024.png`, `dmg-background.png`, and `app-icon.ico` are optional
fallbacks for CI.

## Windows (.exe / .zip)

After `render-asset.sh` (or `python3 desktop-agent/assets/build-app-icon-ico.py`):

```powershell
.\windows\build-portable.ps1 -BuildInstaller   # needs Inno Setup (iscc)
```

- **`kku-card-api-setup.exe`** — icon from `SetupIconFile` in `KKU-Card-API.iss`
- **`kku-card-api-windows.zip`** — includes `app-icon.ico` for shortcut icons

## Version sync

Installer version tracks **`APP_VERSION`** in `frontend/src/lib/app-meta.ts`:

```bash
bash desktop-agent/scripts/sync-agent-version.sh
```

Updates `mac/Contents/Info.plist` and generates `windows/version.iss` (gitignored).
`build-dmg.sh`, `build-all.sh`, and `build-portable.ps1` run this automatically.

## Reinstall / upgrade

| Platform | Behaviour |
| --- | --- |
| **macOS .dmg** | Drag to Applications → macOS **Replace** dialog if app exists. Quit from Dock (Cmd+Q) first. DMG includes `อ่านก่อนติดตั้ง.txt`. |
| **Windows setup.exe** | Thai confirmation if upgrading; stops old API via `%APPDATA%\KKU-Card-API\card-api.pid` before copy; `CloseApplications=force`. |
| **Windows zip** | Overwrite folder; quit tray first. See `INSTALL-reinstall.txt` in package. |

Full notes: `assets/INSTALL-reinstall.txt`.

## Build from repo root

```bash
bash desktop-agent/build-all.sh
# or from frontend/
npm run agent:pack
```

## Usage

1. Install / run the desktop agent — **no Terminal / CMD window**
   (Mac: Dock icon; Windows: system tray).
2. Open <https://lib.kku.ac.th/smart-access/admin/idcard> (often opens automatically).
3. **ตั้งค่าเครื่องอ่าน** → Card API URL = `http://127.0.0.1:8000`
   (or port file under Application Support / `%APPDATA%\KKU-Card-API\`).
4. Plug USB reader and read cards.

## Quit

| Platform | How to stop |
| --- | --- |
| **macOS** | Icon in **Dock** → right-click → **Quit** (or menu **KKU Card API → Quit**, Cmd+Q) |
| **Windows** | **Taskbar** icon → right-click → **Close window**, or tray icon → **Quit KKU Card API** |

Logs: `~/Library/Logs/KKU-Card-API.log` (Mac) /
`%APPDATA%\KKU-Card-API\card-api.log` (Windows).

## vs Chrome Extension

| Topic | Desktop (.dmg / .exe) | Chrome Extension |
| --- | --- | --- |
| Browser | Any (set URL in settings) | Chrome only |
| Install | App / zip | Extension + Native Host |
| Updates | Re-download installer | Reload extension |

Both use the same Python `backend/` code.
