#!/usr/bin/env bash
# Render PNG assets from SVG (macOS). Run after editing desktop-agent/assets/*.svg
set -euo pipefail

MAC_DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$(cd "$MAC_DIR/../assets" && pwd)"
BG_PNG="$ASSETS/dmg-background.png"
BG_SVG="$ASSETS/dmg-background.svg"

# shellcheck source=build-icon.sh
source "$MAC_DIR/build-icon.sh"

render_app_icon_png

render_bg() {
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w 1320 -h 800 "$BG_SVG" -o "$BG_PNG"
    return 0
  fi
  if command -v magick >/dev/null 2>&1; then
    magick -background none "$BG_SVG" -resize 1320x800 "$BG_PNG"
    return 0
  fi
  if command -v qlmanage >/dev/null 2>&1; then
    local tmp rendered
    tmp="$(mktemp -d)"
    qlmanage -t -s 800 -o "$tmp" "$BG_SVG" >/dev/null 2>&1 || true
    rendered="$tmp/$(basename "$BG_SVG").png"
    if [[ -f "$rendered" ]]; then
      cp "$rendered" "$BG_PNG"
      rm -rf "$tmp"
      return 0
    fi
    rm -rf "$tmp"
  fi
  echo "Cannot render dmg-background.png (brew install librsvg recommended)"
  exit 1
}

render_bg
build_icns
python3 "$ASSETS/build-app-icon-ico.py"
echo "Rendered: $ASSETS/app-icon-1024.png"
echo "Rendered: $BG_PNG"
