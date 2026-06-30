import { useRef } from "react";
import type { ReactNode, PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { playClick } from "@/lib/audio/alarm";

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
    didDrag.current = false;
  }

  function handleClick() {
    if (didDrag.current) return;
    if (onClick) {
      playClick();
      onClick();
    }
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
        "relative grid place-items-center select-none transition-transform duration-100 ease-out",
        "active:scale-[0.95]",
        draggable ? "cursor-grab active:cursor-grabbing" : onClick && "cursor-pointer",
      )}
      style={{ width: size, height: size }}
    >
      {/* 水晶球体 SVG：折射渐变 + 高光弧 + 进度环 */}
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
      >
        <defs>
          {/* 球体体积感：左上亮、右下暗，模拟光线从左上方射入 */}
          <radialGradient id="crystal-fill" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(180,200,230,0.18)" />
          </radialGradient>
          {/* 顶部高光弧：模拟玻璃球顶部折射亮斑 */}
          <radialGradient id="crystal-highlight" cx="42%" cy="22%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          {/* 底部内阴影：模拟玻璃厚度 */}
          <radialGradient id="crystal-shadow" cx="50%" cy="85%" r="55%">
            <stop offset="0%" stopColor="rgba(100,130,180,0.18)" />
            <stop offset="100%" stopColor="rgba(100,130,180,0)" />
          </radialGradient>
        </defs>

        {/* 球体底色 */}
        <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 2} fill="url(#crystal-fill)" />
        {/* 底部阴影层 */}
        <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 2} fill="url(#crystal-shadow)" />
        {/* 顶部折射高光 */}
        <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 2} fill="url(#crystal-highlight)" />

        {/* 进度环（旋转到从顶部开始） */}
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
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
        </g>

        {/* 玻璃边缘高光：顶部弧线反光 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - stroke / 2 - 2}
          fill="none"
          strokeWidth={1.5}
          stroke="rgba(255,255,255,0.55)"
          strokeDasharray={`${(radius - stroke / 2 - 2) * Math.PI * 0.6} 9999`}
          strokeDashoffset={-(radius - stroke / 2 - 2) * Math.PI * 0.55}
          strokeLinecap="round"
          transform={`rotate(-60 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-1 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
