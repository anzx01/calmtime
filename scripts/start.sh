#!/usr/bin/env bash
# 启动生产服务器（用于验证 PWA / 离线），日志输出到 logs/start.log
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p logs

PORT="${PORT:-3000}"
echo "[start] starting production server on port ${PORT} ..."
PORT="${PORT}" pnpm start 2>&1 | tee logs/start.log
