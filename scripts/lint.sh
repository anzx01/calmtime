#!/usr/bin/env bash
# 代码检查：ESLint + TypeScript 类型检查，日志输出到 logs/lint.log
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p logs

echo "[lint] running tsc --noEmit ..."
pnpm typecheck 2>&1 | tee logs/lint.log

echo "[lint] running eslint ..."
pnpm lint 2>&1 | tee -a logs/lint.log
echo "[lint] done."
