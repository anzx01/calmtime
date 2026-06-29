/* eslint-disable no-console */
type Level = "debug" | "info" | "warn" | "error";

const isDev = process.env.NODE_ENV !== "production";

function emit(level: Level, args: unknown[]): void {
  // 生产环境仅保留 error，开发环境全量分级输出
  if (!isDev && level !== "error") return;
  console[level]("[calmtime]", ...args);
}

export const clientLogger = {
  debug: (...args: unknown[]) => emit("debug", args),
  info: (...args: unknown[]) => emit("info", args),
  warn: (...args: unknown[]) => emit("warn", args),
  error: (...args: unknown[]) => emit("error", args),
};
