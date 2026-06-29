import Link from "next/link";
import { AppBackground } from "@/components/layout/AppBackground";
import { StatsPanel } from "@/components/stats/StatsPanel";
import { HomeIcon } from "@/components/ui/icons";

export default function StatsPage() {
  return (
    <>
      <AppBackground />
      <div className="min-h-dvh">
        <header className="mx-auto flex max-w-xl items-center gap-3 px-4 py-4">
          <Link
            href="/"
            aria-label="Back to timer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20"
          >
            <HomeIcon />
          </Link>
          <h1 className="text-lg font-extrabold">Focus Report</h1>
        </header>
        <main className="mx-auto max-w-xl px-4 pb-16">
          <StatsPanel />
        </main>
      </div>
    </>
  );
}
