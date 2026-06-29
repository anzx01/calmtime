"use client";

/**
 * 年度番茄热力图（GitHub 风格）。
 * 展示过去 365 天，列=周（周一在上），每格颜色深浅代表当日番茄数。
 */
import { useMemo } from "react";
import { useStatsStore } from "@/stores/stats.store";
import { localDateKey, startOfDay } from "@/lib/utils/time";

const DAY_MS = 86_400_000;
const WEEKS = 53;
const DAYS = 7;

function intensityClass(count: number): string {
  if (count === 0) return "bg-white/10";
  if (count <= 2) return "bg-emerald-400/40";
  if (count <= 4) return "bg-emerald-400/65";
  if (count <= 7) return "bg-emerald-400/85";
  return "bg-emerald-400";
}

function buildGrid(pomodorosByDate: Map<string, number>, now: number) {
  // 从「今天」向前数 364 天（共 365 天）
  const todayStart = startOfDay(now);
  // 找到 today 所在周的周一作为最后一列的末尾
  const todayDow = (new Date(todayStart).getDay() + 6) % 7; // 0=Mon
  const lastColEnd = todayStart + (6 - todayDow) * DAY_MS; // 最后一列周日
  const gridStart = lastColEnd - (WEEKS * 7 - 1) * DAY_MS;

  const grid: { date: string; count: number; ts: number }[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: { date: string; count: number; ts: number }[] = [];
    for (let d = 0; d < DAYS; d++) {
      const ts = gridStart + (w * 7 + d) * DAY_MS;
      const key = localDateKey(ts);
      col.push({ date: key, count: pomodorosByDate.get(key) ?? 0, ts });
    }
    grid.push(col);
  }
  return grid;
}

export function YearHeatmap() {
  const sessions = useStatsStore((s) => s.sessions);

  const { pomodorosByDate, totalDays, maxPerDay } = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (s.mode === "pomodoro" && s.reason === "finished") {
        const k = localDateKey(s.startedAt);
        map.set(k, (map.get(k) ?? 0) + 1);
      }
    }
    return {
      pomodorosByDate: map,
      totalDays: map.size,
      maxPerDay: map.size > 0 ? Math.max(...map.values()) : 0,
    };
  }, [sessions]);

  const grid = useMemo(() => buildGrid(pomodorosByDate, Date.now()), [pomodorosByDate]);

  // 月份标签：取每列第一天所在月
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    grid.forEach((col, w) => {
      const d = new Date(col[0].ts);
      const m = d.getMonth();
      if (m !== lastMonth) {
        labels.push({ label: d.toLocaleString("en", { month: "short" }), col: w });
        lastMonth = m;
      }
    });
    return labels;
  }, [grid]);

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">Past year</h3>
        <span className="text-xs text-white/40">
          {totalDays} active days · best day {maxPerDay} 🍅
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-0.5" style={{ width: `${WEEKS * 14}px` }}>
          {/* 星期标签列 */}
          <div className="flex flex-col gap-0.5 mr-1 pt-5">
            {dayLabels.map((l, i) => (
              <div key={i} className="h-3 w-6 text-right text-[9px] leading-3 text-white/30 pr-1">
                {l}
              </div>
            ))}
          </div>

          {/* 热力格 */}
          <div className="flex flex-col">
            {/* 月份标签行 */}
            <div className="relative h-5 mb-0.5" style={{ width: `${WEEKS * 14}px` }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={label + col}
                  className="absolute text-[9px] text-white/40"
                  style={{ left: `${col * 14}px` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex gap-0.5">
              {grid.map((col, w) => (
                <div key={w} className="flex flex-col gap-0.5">
                  {col.map((cell) => (
                    <div
                      key={cell.date}
                      title={`${cell.date}: ${cell.count} pomodoro${cell.count !== 1 ? "s" : ""}`}
                      className={`h-3 w-3 rounded-[2px] transition-colors ${intensityClass(cell.count)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-[10px] text-white/30">Less</span>
        {[0, 2, 4, 7, 9].map((n) => (
          <div key={n} className={`h-3 w-3 rounded-[2px] ${intensityClass(n)}`} />
        ))}
        <span className="text-[10px] text-white/30">More</span>
      </div>
    </div>
  );
}
