"use client";
import type { ReportRange } from "@/types";
import { cn } from "@/lib/utils/cn";

const RANGES: { id: ReportRange; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

export function RangeSwitcher({
  value,
  onChange,
}: {
  value: ReportRange;
  onChange: (range: ReportRange) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full bg-black/15 p-1">
      {RANGES.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onChange(r.id)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            value === r.id ? "bg-white/20 text-white" : "text-white/70 hover:text-white",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
