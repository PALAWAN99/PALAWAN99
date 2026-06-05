#!/usr/bin/env bash
# Pack extension for Load unpacked / internal distribution.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$DIR/dist/kku-smart-access-card-bridge.zip"
mkdir -p "$DIR/dist"
rm -f "$OUT"
if command -v zip >/dev/null 2>&1; then
  (cd "$DIR" && zip -r "$OUT" manifest.json service-worker.js content-bridge.js popup.html popup.js icons EXTENSION_ID native-host/card_bridge_host.py native-host/com.kku.lib.smartaccess.card.json.template -x "*.DS_Store")
else
  echo "zip command not found, using Python fallback..."
  python3 -c "
import zipfile, os
out_path = '$OUT'
dir_path = '$DIR'
files = ['manifest.json', 'service-worker.js', 'content-bridge.js', 'popup.html', 'popup.js', 'icons', 'EXTENSION_ID', 'native-host/card_bridge_host.py', 'native-host/com.kku.lib.smartaccess.card.json.template']
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in files:
        full_path = os.path.join(dir_path, f)
        if os.path.isdir(full_path):
            for root, dirs, filenames in os.walk(full_path):
                for filename in filenames:
                    if '.DS_Store' in filename: continue
                    file_absolute = os.path.join(root, filename)
                    file_relative = os.path.relpath(file_absolute, dir_path)
                    zipf.write(file_absolute, file_relative)
        else:
            if os.path.exists(full_path):
                zipf.write(full_path, f)
  " || python -c "
import zipfile, os
out_path = '$OUT'
dir_path = '$DIR'
files = ['manifest.json', 'service-worker.js', 'content-bridge.js', 'popup.html', 'popup.js', 'icons', 'EXTENSION_ID', 'native-host/card_bridge_host.py', 'native-host/com.kku.lib.smartaccess.card.json.template']
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in files:
        full_path = os.path.join(dir_path, f)
        if os.path.isdir(full_path):
            for root, dirs, filenames in os.walk(full_path):
                for filename in filenames:
                    if '.DS_Store' in filename: continue
                    file_absolute = os.path.join(root, filename)
                    file_relative = os.path.relpath(file_absolute, dir_path)
                    zipf.write(file_absolute, file_relative)
        else:
            if os.path.exists(full_path):
                zipf.write(full_path, f)
  "
fi
echo "Built: $OUT"
