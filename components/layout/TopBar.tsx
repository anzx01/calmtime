"use client";
import { SettingsIcon } from "@/components/ui/icons";

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <button
      type="button"
      aria-label="Settings"
      title="Settings"
      onClick={onOpenSettings}
      className="fixed top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.05] text-[#8E8E93] transition-colors hover:bg-black/10 hover:text-[#1C1C1E]"
    >
      <SettingsIcon size={19} />
    </button>
  );
}
