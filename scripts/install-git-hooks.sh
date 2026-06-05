#!/bin/sh
# ตั้งค่า git ให้ใช้ hooks จาก .githooks/ (รันครั้งเดียวต่อ clone)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
chmod +x .githooks/post-commit 2>/dev/null || true
git config core.hooksPath .githooks
echo "✅ core.hooksPath=.githooks — หลัง commit จะรัน npm run changelog:auto ใน frontend (ถ้ามี DATABASE_URL)"
