#!/usr/bin/env sh
# Build one-click installer zips (Mac .command / Windows .bat + extension + backend).
set -eu

zip_folder() {
  zip_out="$1"
  stage_dir="$2"
  if command -v zip >/dev/null 2>&1; then
    (cd "$stage_dir" && zip -r "$zip_out" KKU-Card-Bridge -x "*.DS_Store")
  else
    echo "zip command not found, using Python fallback for $zip_out..."
    python3 -c "
import zipfile, os
out_path = '$zip_out'
stage_dir = '$stage_dir'
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, filenames in os.walk(os.path.join(stage_dir, 'KKU-Card-Bridge')):
        for filename in filenames:
            if '.DS_Store' in filename: continue
            file_absolute = os.path.join(root, filename)
            file_relative = os.path.relpath(file_absolute, stage_dir)
            zipf.write(file_absolute, file_relative)
    " || python -c "
import zipfile, os
out_path = '$zip_out'
stage_dir = '$stage_dir'
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, filenames in os.walk(os.path.join(stage_dir, 'KKU-Card-Bridge')):
        for filename in filenames:
            if '.DS_Store' in filename: continue
            file_absolute = os.path.join(root, filename)
            file_relative = os.path.relpath(file_absolute, stage_dir)
            zipf.write(file_absolute, file_relative)
    "
  fi
}

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
EXT="$ROOT/extension"
OUT="$EXT/dist"
STAGE="$(mktemp -d)"
PKG="$STAGE/KKU-Card-Bridge"

mkdir -p "$PKG/extension" "$PKG/backend" "$OUT"

# Extension runtime files
cp "$EXT/manifest.json" "$EXT/service-worker.js" "$EXT/content-bridge.js" \
  "$EXT/popup.html" "$EXT/popup.js" "$EXT/EXTENSION_ID" \
  "$PKG/extension/"
cp -R "$EXT/icons" "$PKG/extension/"
mkdir -p "$PKG/extension/native-host"
cp "$EXT/native-host/card_bridge_host.py" \
  "$EXT/native-host/card_bridge_host.bat" \
  "$EXT/native-host/com.kku.lib.smartaccess.card.json.template" \
  "$PKG/extension/native-host/"
cp "$EXT/install-native-host.sh" "$PKG/extension/"
{ printf '\xef\xbb\xbf'; cat "$EXT/install-native-host.ps1"; } > "$PKG/extension/install-native-host.ps1"

# Backend Python modules (no venv)
cp "$ROOT/backend/requirements.txt" "$PKG/backend/"
cp "$ROOT/backend"/*.py "$PKG/backend/" 2>/dev/null || true

cp "$EXT/easy-install/Install-Mac.command" "$PKG/"
cp "$EXT/easy-install/Install-Windows.bat" "$PKG/"
chmod +x "$PKG/Install-Mac.command" "$PKG/extension/install-native-host.sh" \
  "$PKG/extension/native-host/card_bridge_host.py"

MAC_ZIP="$OUT/kku-card-bridge-easy-install-mac.zip"
WIN_ZIP="$OUT/kku-card-bridge-easy-install-windows.zip"
rm -f "$MAC_ZIP" "$WIN_ZIP"

zip_folder "$MAC_ZIP" "$STAGE"
# Windows zip: extension + desktop Card API launcher (ASCII-safe PowerShell + UTF-8 BOM)
cp "$ROOT/desktop-agent/windows/Start-KKU-Card-API.bat" "$PKG/"
{ printf '\xef\xbb\xbf'; cat "$ROOT/desktop-agent/windows/Start-KKU-Card-API.ps1"; } > "$PKG/Start-KKU-Card-API.ps1"
APP_VER="$(grep -E "^export const APP_VERSION = " "$ROOT/frontend/src/lib/app-meta.ts" | head -1 | sed -E "s/.*'([^']+)'.*/\1/")"
echo "package=kku-card-bridge-easy-install-windows" > "$PKG/VERSION.txt"
echo "app_version=$APP_VER" >> "$PKG/VERSION.txt"
echo "built=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$PKG/VERSION.txt"
zip_folder "$WIN_ZIP" "$STAGE"

rm -rf "$STAGE"
echo "Built: $MAC_ZIP"
echo "Built: $WIN_ZIP"
