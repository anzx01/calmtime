"use client";
import Link from "next/link";
import { IconButton } from "@/components/ui/IconButton";
import { ChartIcon, SettingsIcon } from "@/components/ui/icons";
import { UserMenu } from "./UserMenu";

const linkButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors";

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-4">
      <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
        <span aria-hidden>🍅</span>
        <span>CalmTime</span>
      </Link>
      <nav className="flex items-center gap-2">
        <Link href="/stats" aria-label="Report" title="Report" className={linkButton}>
          <ChartIcon />
        </Link>
        <IconButton label="Settings" onClick={onOpenSettings}>
          <SettingsIcon />
        </IconButton>
        <UserMenu />
      </nav>
    </header>
  );
}
