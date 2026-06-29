import { formatClock } from "@/lib/timer/format";

export function TimeDisplay({ remainingMs }: { remainingMs: number }) {
  return (
    <div className="tabular text-center text-6xl leading-none font-bold sm:text-7xl">
      {formatClock(remainingMs)}
    </div>
  );
}
