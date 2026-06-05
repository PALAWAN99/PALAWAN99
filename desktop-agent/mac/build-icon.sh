#!/usr/bin/env bash
# Build AppIcon.icns from desktop-agent/assets/app-icon.svg (macOS only).
set -euo pipefail

MAC_DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$(cd "$MAC_DIR/../assets" && pwd)"
ICONSET="$MAC_DIR/AppIcon.iconset"
ICNS="$MAC_DIR/AppIcon.icns"
SRC_PNG="$ASSETS/app-icon-1024.png"
SRC_SVG="$ASSETS/app-icon.svg"

render_app_icon_png() {
  if [[ -f "$SRC_PNG" ]]; then
    return 0
  fi
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w 1024 -h 1024 "$SRC_SVG" -o "$SRC_PNG"
    return 0
  fi
  if command -v magick >/dev/null 2>&1; then
    magick -background none "$SRC_SVG" -resize 1024x1024 "$SRC_PNG"
    return 0
  fi
  if command -v qlmanage >/dev/null 2>&1; then
    local tmp rendered
    tmp="$(mktemp -d)"
    qlmanage -t -s 1024 -o "$tmp" "$SRC_SVG" >/dev/null 2>&1 || true
    rendered="$tmp/$(basename "$SRC_SVG").png"
    if [[ -f "$rendered" ]]; then
      cp "$rendered" "$SRC_PNG"
      rm -rf "$tmp"
      return 0
    fi
    rm -rf "$tmp"
  fi
  echo "Cannot render app-icon-1024.png. Install librsvg (brew install librsvg) or commit $SRC_PNG"
  return 1
}

build_icns() {
  if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "build-icon.sh: macOS only (skipped)"
    return 0
  fi
  render_app_icon_png
  rm -rf "$ICONSET"
  mkdir -p "$ICONSET"
  make_icon() {
    sips -z "$1" "$1" "$SRC_PNG" --out "$ICONSET/$2" >/dev/null
  }
  make_icon 16 icon_16x16.png
  make_icon 32 icon_16x16@2x.png
  make_icon 32 icon_32x32.png
  make_icon 64 icon_32x32@2x.png
  make_icon 128 icon_128x128.png
  make_icon 256 icon_128x128@2x.png
  make_icon 256 icon_256x256.png
  make_icon 512 icon_256x256@2x.png
  make_icon 512 icon_512x512.png
  make_icon 1024 icon_512x512@2x.png
  iconutil -c icns "$ICONSET" -o "$ICNS"
  rm -rf "$ICONSET"
  echo "Built: $ICNS"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  build_icns
fi
