#!/usr/bin/env bash
# Register Chrome Native Messaging host (macOS). Usage:
#   ./extension/install-native-host.sh <chrome-extension-id>
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXT_ID="${1:-}"
ID_FILE="$(dirname "$0")/EXTENSION_ID"

if [[ -z "$EXT_ID" && -f "$ID_FILE" ]]; then
  EXT_ID="$(tr -d '[:space:]' < "$ID_FILE")"
fi

if [[ -z "$EXT_ID" ]]; then
  echo "Usage: $0 [chrome-extension-id]"
  echo "  Default ID is in extension/EXTENSION_ID when using the fixed manifest key."
  exit 1
fi

HOST_PY="$ROOT/extension/native-host/card_bridge_host.py"
WRAPPER="$ROOT/extension/native-host/card_bridge_host.sh"
chmod +x "$HOST_PY"

VENV_PY="$ROOT/backend/venv/bin/python"
if [[ -x "$VENV_PY" ]]; then
  cat > "$WRAPPER" <<EOF
#!/usr/bin/env bash
exec "$VENV_PY" "$HOST_PY"
EOF
else
  cat > "$WRAPPER" <<EOF
#!/usr/bin/env bash
exec python3 "$HOST_PY"
EOF
fi
chmod +x "$WRAPPER"

TEMPLATE="$ROOT/extension/native-host/com.kku.lib.smartaccess.card.json.template"
MANIFEST_JSON="$(mktemp)"
sed -e "s|__HOST_SCRIPT_PATH__|$WRAPPER|g" \
  -e "s|__EXTENSION_ID__|$EXT_ID|g" \
  "$TEMPLATE" > "$MANIFEST_JSON"

DEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
mkdir -p "$DEST_DIR"
cp "$MANIFEST_JSON" "$DEST_DIR/com.kku.lib.smartaccess.card.json"
rm -f "$MANIFEST_JSON"

echo "Installed: $DEST_DIR/com.kku.lib.smartaccess.card.json"
echo "Extension ID: $EXT_ID"
echo "Host script: $HOST_PY"
echo ""
echo "Ensure backend venv + deps: cd backend && python3.12 -m venv venv && ./venv/bin/pip install -r requirements.txt"
echo "Restart Chrome, open extension popup → ทดสอบ Native Host"
