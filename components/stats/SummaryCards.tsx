import type { StatsSummary } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <GlassCard className="flex flex-col items-center gap-0.5 px-3 py-4 text-center">
      <span className="tabular text-2xl font-bold">{value}</span>
      <span className="text-xs text-white/65">{label}</span>
    </GlassCard>
  );
}

export function SummaryCards({ summary }: { summary: StatsSummary }) {
  const hours = Math.floor(summary.totalFocusMinutes / 60);
  const mins = summary.totalFocusMinutes % 60;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card label="Pomodoros" value={summary.totalPomodoros} />
      <Card label="Focus time" value={`${hours}h ${mins}m`} />
      <Card label="Day streak" value={summary.streakDays} />
      <Card label="Daily avg" value={summary.dailyAverage} />
    </div>
  );
}
