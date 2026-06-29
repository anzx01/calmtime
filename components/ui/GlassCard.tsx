import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
}

export function GlassCard({ children, strong, className, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass", strong && "glass-strong", className)} {...props}>
      {children}
    </div>
  );
}
