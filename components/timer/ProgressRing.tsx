import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ProgressRingProps {
  progress: number; // 0..1
  children: ReactNode;
  onClick?: () => void;
  running?: boolean;
  size?: number;
}

export function ProgressRing({ progress, children, onClick, running = false, size = 240 }: ProgressRingProps) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? (running ? "暂停" : "开始专注") : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={cn(
        "relative grid place-items-center select-none",
        onClick && "cursor-pointer",
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={stroke}
          className="ring-track"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300 ease-linear ring-progress"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-1">
        {children}
      </div>
      {/* 点击时的涟漪提示 */}
      {onClick && !running && (
        <div className="pointer-events-none absolute inset-0 rounded-full transition-opacity opacity-0 hover:opacity-100 bg-black/[0.02]" />
      )}
    </div>
  );
}
