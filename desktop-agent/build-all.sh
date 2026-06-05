#!/usr/bin/env bash
# Build desktop agent artifacts into desktop-agent/dist/ and copy to frontend/public/downloads/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AGENT="$(cd "$(dirname "$0")" && pwd)"
DIST="$AGENT/dist"
FE_DL="$ROOT/frontend/public/downloads"

bash "$AGENT/scripts/sync-agent-version.sh"

mkdir -p "$DIST" "$FE_DL"

if [[ "$(uname -s)" == "Darwin" ]]; then
  if [[ -f "$AGENT/assets/app-icon-1024.png" ]]; then
    python3 "$AGENT/assets/build-app-icon-ico.py" 2>/dev/null || true
  fi
  bash "$AGENT/mac/build-dmg.sh"
else
  echo "Skip .dmg (macOS build only)"
fi

if command -v pwsh >/dev/null 2>&1; then
  pwsh -File "$AGENT/windows/build-portable.ps1"
elif command -v powershell >/dev/null 2>&1; then
  powershell -File "$AGENT/windows/build-portable.ps1"
else
  echo "Skip Windows zip (run build-portable.ps1 on Windows, or install pwsh)"
  # Pack Windows files without venv for download (first-run install)
  WIN_STAGE="$(mktemp -d)"
  PKG="$WIN_STAGE/KKU-Card-API"
  mkdir -p "$PKG/backend"
  cp "$ROOT/backend/requirements.txt" "$PKG/backend/"
  cp "$ROOT/backend"/*.py "$PKG/backend/"
  cp "$AGENT/windows/Start-KKU-Card-API.bat" "$PKG/"
  cp "$AGENT/windows/Start-KKU-Card-API-launch.vbs" "$PKG/"
  if [[ -f "$AGENT/assets/app-icon.ico" ]]; then
    cp "$AGENT/assets/app-icon.ico" "$PKG/"
  fi
  # UTF-8 BOM so Windows PowerShell 5.1 reads ASCII/UTF-8 reliably
  { printf '\xef\xbb\xbf'; cat "$AGENT/windows/Start-KKU-Card-API.ps1"; } > "$PKG/Start-KKU-Card-API.ps1"
  APP_VER="$(grep -E "^export const APP_VERSION = " "$ROOT/frontend/src/lib/app-meta.ts" | head -1 | sed -E "s/.*'([^']+)'.*/\1/")"
  echo "package=kku-card-api-windows" > "$PKG/VERSION.txt"
  echo "app_version=$APP_VER" >> "$PKG/VERSION.txt"
  echo "built=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$PKG/VERSION.txt"
  if [[ -f "$AGENT/assets/INSTALL-reinstall.txt" ]]; then
    cp "$AGENT/assets/INSTALL-reinstall.txt" "$PKG/INSTALL-reinstall.txt"
  fi
  cat > "$PKG/README.txt" <<'EOF'
KKU Card API (Windows) — ไม่ต้องใช้ Chrome Extension
1. ติดตั้ง Python 3.10+ จาก python.org
2. ดับเบิลคลิก Start-KKU-Card-API.bat
3. ตั้งค่า URL ใน Admin > อ่านบัตร > ตั้งค่าเครื่องอ่าน → http://127.0.0.1:8000
EOF
  if command -v zip >/dev/null 2>&1; then
    (cd "$WIN_STAGE" && zip -r "$DIST/kku-card-api-windows.zip" KKU-Card-API -x "*.DS_Store")
  else
    echo "zip command not found, using Python fallback..."
    python3 -c "
import zipfile, os
out_path = '$DIST/kku-card-api-windows.zip'
stage_dir = '$WIN_STAGE'
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, filenames in os.walk(os.path.join(stage_dir, 'KKU-Card-API')):
        for filename in filenames:
            if '.DS_Store' in filename: continue
            file_absolute = os.path.join(root, filename)
            file_relative = os.path.relpath(file_absolute, stage_dir)
            zipf.write(file_absolute, file_relative)
    " || python -c "
import zipfile, os
out_path = '$DIST/kku-card-api-windows.zip'
stage_dir = '$WIN_STAGE'
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, filenames in os.walk(os.path.join(stage_dir, 'KKU-Card-API')):
        for filename in filenames:
            if '.DS_Store' in filename: continue
            file_absolute = os.path.join(root, filename)
            file_relative = os.path.relpath(file_absolute, stage_dir)
            zipf.write(file_absolute, file_relative)
    "
  fi
  rm -rf "$WIN_STAGE"
  echo "Built (source-only): $DIST/kku-card-api-windows.zip"
fi

for f in kku-card-api-mac.dmg kku-card-api-windows.zip; do
  if [[ -f "$DIST/$f" ]]; then
    cp "$DIST/$f" "$FE_DL/"
    echo "Copied to $FE_DL/$f"
  fi
done

echo "Done. API: /api/card-agent?os=mac|windows"
