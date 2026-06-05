#!/usr/bin/env bash
# Build KKU Card API.app and .dmg (run on macOS).
set -euo pipefail

bash "$(cd "$(dirname "$0")/.." && pwd)/scripts/sync-agent-version.sh"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
AGENT="$(cd "$(dirname "$0")/.." && pwd)"
MAC_DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$AGENT/assets"
OUT="$AGENT/dist"
APP_NAME="KKU Card API"
APP="$OUT/${APP_NAME}.app"
DMG="$OUT/kku-card-api-mac.dmg"
STAGE="$(mktemp -d)"

cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

echo "Building ${APP_NAME}.app ..."

PYTHON=""
for candidate in /opt/homebrew/bin/python3.12 python3.12 python3; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PYTHON="$(command -v "$candidate")"
    break
  fi
done
if [[ -z "$PYTHON" ]]; then
  echo "Need Python 3.12+ (brew install python@3.12)"
  exit 1
fi

bash "$MAC_DIR/build-icon.sh"

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/app/backend" "$APP/Contents/Resources/app/bin"

cp "$MAC_DIR/Contents/Info.plist" "$APP/Contents/"
cp "$MAC_DIR/Contents/MacOS/kku-card-api-worker" "$APP/Contents/MacOS/"
chmod +x "$APP/Contents/MacOS/kku-card-api-worker"
if command -v swiftc >/dev/null 2>&1; then
  swiftc -O -framework Cocoa -o "$APP/Contents/MacOS/kku-card-api" "$MAC_DIR/KkuCardApiApp.swift"
  chmod +x "$APP/Contents/MacOS/kku-card-api"
  echo "Built native Dock launcher (kku-card-api)"
else
  echo "WARN: swiftc not found — app may not show Dock Quit menu; install Xcode CLT"
  cp "$APP/Contents/MacOS/kku-card-api-worker" "$APP/Contents/MacOS/kku-card-api"
  chmod +x "$APP/Contents/MacOS/kku-card-api"
fi
cp "$AGENT/shared/pick-port.sh" "$APP/Contents/Resources/app/bin/pick-port.sh"
chmod +x "$APP/Contents/Resources/app/bin/pick-port.sh"

if [[ -f "$MAC_DIR/AppIcon.icns" ]]; then
  cp "$MAC_DIR/AppIcon.icns" "$APP/Contents/Resources/AppIcon.icns"
fi

cp "$ROOT/backend/requirements.txt" "$APP/Contents/Resources/app/backend/"
cp "$ROOT/backend"/*.py "$APP/Contents/Resources/app/backend/"

echo "Creating venv in app bundle (may take a minute)..."
"$PYTHON" -m venv "$APP/Contents/Resources/app/venv"
"$APP/Contents/Resources/app/venv/bin/pip" install --upgrade pip -q
"$APP/Contents/Resources/app/venv/bin/pip" install -r "$APP/Contents/Resources/app/backend/requirements.txt" -q
"$APP/Contents/Resources/app/venv/bin/python" -c "import smartcard; print('pyscard OK')"

mkdir -p "$OUT"
rm -f "$DMG"

DMG_STAGE="$STAGE/dmg"
mkdir -p "$DMG_STAGE"
cp -R "$APP" "$DMG_STAGE/"
ln -s /Applications "$DMG_STAGE/Applications"
if [[ -f "$ASSETS/INSTALL-reinstall.txt" ]]; then
  cp "$ASSETS/INSTALL-reinstall.txt" "$DMG_STAGE/อ่านก่อนติดตั้ง.txt"
fi

BG_PNG="$ASSETS/dmg-background.png"
if [[ -f "$BG_PNG" ]]; then
  mkdir -p "$DMG_STAGE/.background"
  cp "$BG_PNG" "$DMG_STAGE/.background/background.png"
  if command -v SetFile >/dev/null 2>&1; then
    SetFile -a V "$DMG_STAGE/.background" || true
  else
    chflags hidden "$DMG_STAGE/.background" 2>/dev/null || true
  fi
fi

RW_DMG="$STAGE/rw.dmg"
hdiutil create -volname "$APP_NAME" -srcfolder "$DMG_STAGE" -ov -format UDRW -size 400m "$RW_DMG" >/dev/null

if [[ -f "$BG_PNG" ]]; then
  MOUNT_OUT="$(hdiutil attach -readwrite -noverify "$RW_DMG")"
  VOLUME="$(echo "$MOUNT_OUT" | awk '/\/Volumes\// {print $3; exit}')"
  if [[ -n "$VOLUME" && -d "$VOLUME" ]]; then
    osascript <<APPLESCRIPT || true
tell application "Finder"
  tell disk "$APP_NAME"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set the bounds of container window to {200, 120, 860, 520}
    set viewOptions to the icon view options of container window
    set arrangement of viewOptions to not arranged
    set icon size of viewOptions to 128
    set background picture of viewOptions to file ".background:background.png"
    set position of item "${APP_NAME}.app" of container window to {150, 220}
    set position of item "Applications" of container window to {450, 220}
    close
    open
    update without registering applications
    delay 2
  end tell
end tell
APPLESCRIPT
    hdiutil detach "$VOLUME" -quiet >/dev/null 2>&1 || hdiutil detach "$VOLUME" -force -quiet >/dev/null 2>&1 || true
  fi
fi

if ! hdiutil convert "$RW_DMG" -format UDZO -o "$DMG" >/dev/null 2>&1; then
  echo "WARN: styled DMG convert failed — building simple UDZO image"
  rm -f "$DMG"
  hdiutil create -volname "$APP_NAME" -srcfolder "$DMG_STAGE" -ov -format UDZO "$DMG" >/dev/null
fi
rm -f "$RW_DMG"

echo "Built: $DMG"
ls -lh "$DMG"
