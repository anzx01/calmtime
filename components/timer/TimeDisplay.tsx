import { formatClock } from "@/lib/timer/format";

export function TimeDisplay({ remainingMs }: { remainingMs: number }) {
  return (
    <div className="tabular text-center leading-none font-thin tracking-tight text-[64px] time-glow">
      {formatClock(remainingMs)}
    </div>
  );
}
