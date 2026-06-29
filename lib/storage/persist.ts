import { createJSONStorage } from "zustand/middleware";
import type { ZodType } from "zod";
import { clientLogger } from "@/lib/logger/client";

/** SSR / 无 localStorage 时的内存兜底实现。 */
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k) => store.get(k) ?? null,
    key: (i) => Array.from(store.keys())[i] ?? null,
    removeItem: (k) => void store.delete(k),
    setItem: (k, v) => void store.set(k, v),
  };
}

/** 供 zustand persist 使用的 JSON storage（客户端 localStorage，SSR 内存兜底）。 */
export const jsonStorage = createJSONStorage(() =>
  typeof window !== "undefined" ? window.localStorage : createMemoryStorage(),
);

/**
 * 用 Zod 校验持久化片段，失败时用 fallback 补齐缺失字段后再试。
 * 这样新增字段时不会因旧数据缺字段而整体回退到默认值。
 */
export function validated<T>(schema: ZodType<T>, value: unknown, fallback: T, label: string): T {
  if (value === undefined) return fallback;

  // 先尝试直接解析
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  // 如果失败，且 value 是对象，用 fallback 补齐缺失字段后再试一次
  if (typeof value === "object" && value !== null && typeof fallback === "object" && fallback !== null) {
    const merged = deepMergeWithFallback(value as Record<string, unknown>, fallback as Record<string, unknown>);
    const retried = schema.safeParse(merged);
    if (retried.success) return retried.data;
  }

  clientLogger.warn(`[storage] invalid "${label}", using fallback`, result.error);
  return fallback;
}

/** 用 fallback 补齐 source 中缺失的字段（深度合并，不覆盖已有值）。 */
function deepMergeWithFallback(
  source: Record<string, unknown>,
  fallback: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...source };
  for (const key of Object.keys(fallback)) {
    if (!(key in result) || result[key] === undefined) {
      result[key] = fallback[key];
    } else if (
      typeof result[key] === "object" &&
      result[key] !== null &&
      typeof fallback[key] === "object" &&
      fallback[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMergeWithFallback(
        result[key] as Record<string, unknown>,
        fallback[key] as Record<string, unknown>,
      );
    }
  }
  return result;
}
