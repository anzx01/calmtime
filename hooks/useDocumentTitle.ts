"use client";
import { useEffect } from "react";
import { formatTitle } from "@/lib/timer/format";

/** 把剩余时间写入标签页标题（切到其他标签也能看到倒计时）。 */
export function useDocumentTitle(remainingMs: number, modeLabel: string, active: boolean): void {
  useEffect(() => {
    document.title = active ? formatTitle(remainingMs, modeLabel) : "CalmTime";
  }, [remainingMs, modeLabel, active]);
}
