import type { SessionRecord, DailyStat, ChartPoint, StatsSummary, ReportRange } from "@/types";
import { localDateKey, startOfDay, mondayIndex, msToMinutes } from "@/lib/utils/time";

const DAY_MS = 86_400_000;

function completed(sessions: SessionRecord[]): SessionRecord[] {
  return sessions.filter((s) => s.mode === "pomodoro" && s.reason === "finished");
}

interface Bucket {
  pomodoros: number;
  focusMs: number;
}

function emptyBucket(): Bucket {
  return { pomodoros: 0, focusMs: 0 };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** 按本地自然日聚合（升序）。 */
export function toDailyStats(sessions: SessionRecord[]): DailyStat[] {
  const map = new Map<string, DailyStat>();
  for (const s of completed(sessions)) {
    const key = localDateKey(s.startedAt);
    const cur = map.get(key) ?? { date: key, pomodoros: 0, focusMs: 0 };
    cur.pomodoros += 1;
    cur.focusMs += s.actualMs;
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}

function bucketize(sessions: SessionRecord[], keyOf: (ts: number) => string) {
  const map = new Map<string, Bucket>();
  for (const s of completed(sessions)) {
    const key = keyOf(s.startedAt);
    const b = map.get(key) ?? emptyBucket();
    b.pomodoros += 1;
    b.focusMs += s.actualMs;
    map.set(key, b);
  }
  return map;
}

function toPoint(label: string, b: Bucket | undefined): ChartPoint {
  return {
    label,
    pomodoros: b?.pomodoros ?? 0,
    focusMinutes: Math.round(msToMinutes(b?.focusMs ?? 0)),
  };
}

function dayPoints(sessions: SessionRecord[], now: number, n: number): ChartPoint[] {
  const map = bucketize(sessions, localDateKey);
  const today0 = startOfDay(now);
  const points: ChartPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const ts = today0 - i * DAY_MS;
    const d = new Date(ts);
    points.push(
      toPoint(`${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`, map.get(localDateKey(ts))),
    );
  }
  return points;
}

function weekStart(ts: number): number {
  return startOfDay(ts) - mondayIndex(ts) * DAY_MS;
}

function weekPoints(sessions: SessionRecord[], now: number, n: number): ChartPoint[] {
  const map = bucketize(sessions, (ts) => localDateKey(weekStart(ts)));
  const thisWeek = weekStart(now);
  const points: ChartPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const ts = thisWeek - i * 7 * DAY_MS;
    const d = new Date(ts);
    points.push(
      toPoint(`${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`, map.get(localDateKey(ts))),
    );
  }
  return points;
}

function monthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function monthPoints(sessions: SessionRecord[], now: number, n: number): ChartPoint[] {
  const map = bucketize(sessions, monthKey);
  const base = new Date(now);
  const points: ChartPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
    points.push(toPoint(key, map.get(key)));
  }
  return points;
}

/** 根据范围生成图表数据点。 */
export function buildChartPoints(
  sessions: SessionRecord[],
  range: ReportRange,
  now: number,
): ChartPoint[] {
  if (range === "day") return dayPoints(sessions, now, 14);
  if (range === "week") return weekPoints(sessions, now, 8);
  return monthPoints(sessions, now, 6);
}

function computeStreak(daily: DailyStat[], now: number): number {
  const keys = new Set(daily.map((d) => d.date));
  let ts = startOfDay(now);
  if (!keys.has(localDateKey(ts))) ts -= DAY_MS; // 今天还没番茄，从昨天起算
  let streak = 0;
  while (keys.has(localDateKey(ts))) {
    streak += 1;
    ts -= DAY_MS;
  }
  return streak;
}

/** 全历史总览（不随 range 变化）。 */
export function summarize(sessions: SessionRecord[], now: number): StatsSummary {
  const done = completed(sessions);
  const daily = toDailyStats(sessions);
  const totalPomodoros = done.length;
  const totalFocusMinutes = Math.round(msToMinutes(done.reduce((acc, s) => acc + s.actualMs, 0)));
  const activeDays = daily.length || 1;
  return {
    totalPomodoros,
    totalFocusMinutes,
    streakDays: computeStreak(daily, now),
    dailyAverage: Math.round((totalPomodoros / activeDays) * 10) / 10,
  };
}
