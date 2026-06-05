#!/usr/bin/env python3
"""Build app-icon.ico from app-icon-1024.png (run after render-asset or commit PNG)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent
PNG = ASSETS / "app-icon-1024.png"
ICO = ASSETS / "app-icon.ico"
SIZES = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]


def main() -> None:
    if not PNG.is_file():
        raise SystemExit(f"Missing {PNG} — run desktop-agent/mac/render-asset.sh first")
    img = Image.open(PNG).convert("RGBA")
    img.save(ICO, format="ICO", sizes=[(w, h) for w, h in SIZES])
    print(f"Built: {ICO}")


if __name__ == "__main__":
    main()
