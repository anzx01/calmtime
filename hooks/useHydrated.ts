"use client";
import { useEffect, useState } from "react";

/** 客户端挂载后返回 true，用于规避 SSR/持久化 hydration mismatch。 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
