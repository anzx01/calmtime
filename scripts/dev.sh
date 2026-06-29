#!/usr/bin/env bash
# 启动开发服务器（Turbopack），日志同时输出到 logs/dev.log
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p logs

PORT="${PORT:-3000}"
echo "[dev] starting Next.js dev server on port ${PORT} ..."
echo "[dev] logs -> logs/dev.log"

# tee 保证终端可见 + 落盘到 logs/
PORT="${PORT}" pnpm dev 2>&1 | tee logs/dev.log
