import type { ReactNode } from "react";

export function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <span className="text-sm text-white/85">{label}</span>
        {hint && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

export const sectionTitle = "mb-1 text-xs font-bold tracking-wide text-white/50 uppercase";
