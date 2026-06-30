import { useRef } from "react";
import type { ReactNode, PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";

interface ProgressRingProps {
  progress: number; // 0..1
  children: ReactNode;
  onClick?: () => void;
  running?: boolean;
  size?: number;
  onDrag?: (ratio: number) => void; // 0..1，从顶部顺时针
}

export function ProgressRing({
  progress,
  children,
  onClick,
  running = false,
  size = 240,
  onDrag,
}: ProgressRingProps) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  const draggable = !!onDrag;
  const downPos = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);
  const divRef = useRef<HTMLDivElement>(null);

  function ratioFromClient(clientX: number, clientY: number): number {
    const el = divRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    return angle / (2 * Math.PI);
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!draggable) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    downPos.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggable || !e.buttons || !downPos.current) return;
    const dx = e.clientX - downPos.current.x;
    const dy = e.clientY - downPos.current.y;
    if (!didDrag.current && Math.hypot(dx, dy) < 6) return;
    didDrag.current = true;
    onDrag?.(ratioFromClient(e.clientX, e.clientY));
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!draggable) return;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    downPos.current = null;
  }

  function handleClick() {
    // 发生过拖动则忽略点击
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    onClick?.();
  }

  return (
    <div
      ref={divRef}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? (running ? "暂停" : "开始专注") : undefined}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "relative grid place-items-center select-none",
        draggable ? "cursor-grab active:cursor-grabbing" : onClick && "cursor-pointer",
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="ring-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-progress transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-1 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
