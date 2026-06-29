#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
LOG="$ROOT/logs/migrate.log"
mkdir -p "$ROOT/logs" "$ROOT/data"

echo "[migrate] running db migrations..." | tee -a "$LOG"
cd "$ROOT"
# 使用 drizzle-kit push（直接同步 schema，无需单独执行 migrate.ts）
pnpm drizzle-kit push 2>&1 | tee -a "$LOG"
echo "[migrate] done" | tee -a "$LOG"
