#!/usr/bin/env bash
# 用 Prettier 格式化代码
set -euo pipefail

cd "$(dirname "$0")/.."
echo "[format] running prettier ..."
pnpm exec prettier --write "**/*.{ts,tsx,css,json,md}" --log-level warn
echo "[format] done."
