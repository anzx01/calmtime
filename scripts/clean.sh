#!/usr/bin/env bash
# 清理构建产物与日志
set -euo pipefail

cd "$(dirname "$0")/.."
echo "[clean] removing .next / out / generated sw ..."
rm -rf .next out public/sw.js public/sw.js.map public/swe-worker-*.js 2>/dev/null || true
echo "[clean] truncating logs ..."
find logs -type f ! -name ".gitkeep" -delete 2>/dev/null || true
echo "[clean] done."
