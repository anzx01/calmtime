import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "solid";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  // 白底、模式色文字、底部立体阴影（pomofocus 风格的大按钮）
  primary:
    "bg-white text-[var(--mode-color)] shadow-[var(--shadow-raise)] hover:brightness-95 active:translate-y-[3px] active:shadow-none",
  ghost: "bg-white/15 text-white hover:bg-white/25",
  solid: "bg-[var(--mode-color)] text-white hover:brightness-110",
};

const SIZES: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-12 py-3.5 text-xl tracking-wide",
};

export function Button({
  children,
  variant = "ghost",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-bold uppercase",
        "transition-all duration-100 select-none disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
