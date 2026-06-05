#!/bin/bash
# Double-click installer (macOS): Native Host + auto-load extension in Chrome.
set -euo pipefail
cd "$(dirname "$0")"
export KKU_SMART_ACCESS_ROOT="$(pwd)"

EXT_ID="$(tr -d '[:space:]' < extension/EXTENSION_ID)"
EXT_PATH="$(pwd)/extension"
CHROME_EXT_DIR="$HOME/Library/Application Support/Google/Chrome/External Extensions"
EXT_JSON="$CHROME_EXT_DIR/${EXT_ID}.json"

echo "KKU Card Bridge — ติดตั้งบน Mac"
echo "Extension ID: $EXT_ID"

chmod +x extension/native-host/card_bridge_host.py extension/install-native-host.sh 2>/dev/null || true

PYTHON=""
for candidate in /opt/homebrew/bin/python3.12 python3.12 python3.11 python3; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PYTHON="$(command -v "$candidate")"
    break
  fi
done
if [[ -z "$PYTHON" ]]; then
  echo "ไม่พบ python3 — ติดตั้ง Homebrew python@3.12 ก่อน"
  exit 1
fi
echo "Python: $PYTHON ($("$PYTHON" --version 2>&1))"

echo "สร้าง venv และติดตั้ง packages..."
"$PYTHON" -m venv backend/venv
backend/venv/bin/python -m pip install --upgrade pip
backend/venv/bin/pip install -r backend/requirements.txt
backend/venv/bin/python -c "import smartcard; print('pyscard OK')"

./extension/install-native-host.sh "$EXT_ID"

mkdir -p "$CHROME_EXT_DIR"
printf '%s\n' "{\"path\": \"$EXT_PATH\"}" > "$EXT_JSON"
echo "Registered external extension: $EXT_JSON"

CHROME_APP="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ -x "$CHROME_APP" ]]; then
  echo "เปิด Chrome ใหม่เพื่อโหลด extension..."
  osascript -e 'quit app "Google Chrome"' 2>/dev/null || true
  sleep 1
  open -a "Google Chrome" "https://lib.kku.ac.th/smart-access/admin/idcard"
else
  open "https://lib.kku.ac.th/smart-access/admin/idcard"
fi

INSTALL_MSG="Native Host ติดตั้งแล้ว (ID: ${EXT_ID}).

ขั้นตอนใน Chrome (จำเป็น):
1. เปิด chrome://extensions
2. เปิดโหมดนักพัฒนา (Developer mode)
3. Load unpacked → เลือกโฟลเดอร์:
${EXT_PATH}
4. คลิกไอคอน KKU Card Bridge → ทดสอบ Native Host → เปิด Bridge
5. รีเฟรชหน้าอ่านบัตร

หมายเหตุ: Chrome รุ่นใหม่อาจไม่โหลด extension อัตโนมัติ — ต้อง Load unpacked เอง"

osascript -e "display dialog \"$INSTALL_MSG\" buttons {\"ตกลง\"} default button 1 with title \"KKU Card Bridge\"" || true
