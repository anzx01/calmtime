type ClassValue = string | number | false | null | undefined;

/** 轻量 className 合并（过滤 falsy）。 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
