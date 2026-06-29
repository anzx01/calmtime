import type { Settings } from "@/types";
import { minutesToMs } from "@/lib/utils/time";

/** 专注时长（ms）。 */
export function focusDurationMs(settings: Settings): number {
  return minutesToMs(settings.focusDuration);
}
