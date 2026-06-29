"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSyncStore } from "@/stores/sync.store";

/** 顶栏右侧的用户头像菜单（已登录）或登录按钮（未登录）。 */
export function UserMenu() {
  const user = useSyncStore((s) => s.user);
  const syncing = useSyncStore((s) => s.syncing);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
      >
        <CloudIcon />
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-2 rounded-full focus:outline-none"
        aria-expanded={open}
        aria-label="User menu"
      >
        {syncing && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        )}
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={32}
            height={32}
            className="rounded-full ring-2 ring-white/20"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
            {(user.name ?? user.email ?? "?")[0].toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-52 glass glass-strong rounded-xl p-3 space-y-3 shadow-xl">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
            <div className="border-t border-white/10" />
            <button
              onClick={async () => {
                setOpen(false);
                await fetch("/api/auth/signout", { method: "POST" });
                router.push("/login");
                router.refresh();
              }}
              className="block w-full text-left text-sm text-white/70 hover:text-white transition-colors py-1"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CloudIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}
