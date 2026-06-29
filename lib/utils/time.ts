export const MINUTE_MS = 60_000;

export function minutesToMs(minutes: number): number {
  return Math.round(minutes * MINUTE_MS);
}

export function msToMinutes(ms: number): number {
  return ms / MINUTE_MS;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
