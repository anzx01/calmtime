import type { SessionRecord } from "@/types";
import { localDateKey, msToMinutes } from "@/lib/utils/time";

const HEADERS = [
  "date",
  "mode",
  "startedAt",
  "endedAt",
  "plannedMinutes",
  "actualMinutes",
  "reason",
  "taskId",
] as const;

function escapeCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** 把会话记录序列化为 CSV 文本（供报告下载）。 */
export function sessionsToCsv(sessions: SessionRecord[]): string {
  const lines = [HEADERS.join(",")];
  for (const s of sessions) {
    const row = [
      localDateKey(s.startedAt),
      s.mode,
      new Date(s.startedAt).toISOString(),
      new Date(s.endedAt).toISOString(),
      String(Math.round(msToMinutes(s.plannedMs))),
      String(Math.round(msToMinutes(s.actualMs))),
      s.reason,
      s.taskId ?? "",
    ];
    lines.push(row.map(escapeCell).join(","));
  }
  return lines.join("\n");
}
