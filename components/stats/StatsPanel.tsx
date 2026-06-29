"use client";
import { useState } from "react";
import type { ReportRange } from "@/types";
import { useStatsStore } from "@/stores";
import { useHydrated } from "@/hooks/useHydrated";
import { buildChartPoints, summarize } from "@/lib/stats/aggregate";
import { sessionsToCsv } from "@/lib/stats/csv";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SummaryCards } from "./SummaryCards";
import { RangeSwitcher } from "./RangeSwitcher";
import { FocusChart } from "./FocusChart";
import { YearHeatmap } from "./YearHeatmap";

export function StatsPanel() {
  const hydrated = useHydrated();
  const sessions = useStatsStore((s) => s.sessions);
  const clear = useStatsStore((s) => s.clear);
  const [range, setRange] = useState<ReportRange>("day");

  if (!hydrated) {
    return <GlassCard className="p-8 text-center text-white/60">Loading…</GlassCard>;
  }

  const now = Date.now();
  const summary = summarize(sessions, now);
  const data = buildChartPoints(sessions, range, now);

  const exportCsv = () => {
    const blob = new Blob([sessionsToCsv(sessions)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calmtime-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <SummaryCards summary={summary} />
      <GlassCard className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Focus history</h2>
          <RangeSwitcher value={range} onChange={setRange} />
        </div>
        <FocusChart data={data} />
      </GlassCard>
      <GlassCard className="p-5">
        <YearHeatmap />
      </GlassCard>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={exportCsv} disabled={sessions.length === 0}>
          Export CSV
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm("Clear all focus stats? This cannot be undone.")) clear();
          }}
        >
          Clear data
        </Button>
      </div>
    </div>
  );
}
