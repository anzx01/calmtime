#!/usr/bin/env bash
# 停止占用端口的 Next.js 进程（兼容 Windows Git Bash 与 *nix）
set -uo pipefail

cd "$(dirname "$0")/.."
PORT="${PORT:-3000}"
echo "[stop] looking for process on port ${PORT} ..."

if command -v netstat >/dev/null 2>&1 && [[ "${OS:-}" == "Windows_NT" ]]; then
  # Windows: 解析 netstat 的 PID 列并用 taskkill 终止
  PIDS=$(netstat -ano | grep -E "[:.]${PORT}[[:space:]].*LISTENING" | awk '{print $NF}' | sort -u || true)
  if [[ -z "${PIDS}" ]]; then
    echo "[stop] no process listening on ${PORT}."
    exit 0
  fi
  for pid in ${PIDS}; do
    echo "[stop] taskkill PID ${pid}"
    taskkill //PID "${pid}" //F >/dev/null 2>&1 || true
  done
else
  # *nix: lsof / fuser
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti tcp:"${PORT}" || true)
    [[ -n "${PIDS}" ]] && echo "${PIDS}" | xargs -r kill -9 || echo "[stop] no process on ${PORT}."
  else
    fuser -k "${PORT}/tcp" 2>/dev/null || echo "[stop] no process on ${PORT}."
  fi
fi
echo "[stop] done."
