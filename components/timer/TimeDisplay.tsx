import { formatClock } from "@/lib/timer/format";

export function TimeDisplay({ remainingMs }: { remainingMs: number }) {
  return (
    <div className="tabular text-center leading-none font-thin tracking-tight text-[64px] text-[#1C1C1E]">
      {formatClock(remainingMs)}
    </div>
  );
}
