#!/usr/bin/env bash
# 生产构建（Webpack，PWA/serwist 需要），日志输出到 logs/build.log
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p logs

echo "[build] running production build (webpack) ..."
pnpm build 2>&1 | tee logs/build.log
echo "[build] done."
