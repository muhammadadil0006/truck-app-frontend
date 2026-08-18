import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "ghost";
  icon?: ReactNode;
}

export function Button({
  isLoading,
  loadingText,
  variant = "primary",
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 font-display text-base font-bold tracking-wider uppercase transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-br from-teal-400 to-teal-600 text-ink-950 shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg active:translate-y-0 active:scale-[0.98]",
        variant === "ghost" &&
          "border border-ink-600 bg-ink-800/60 text-ink-100 hover:border-teal-500/60 hover:bg-ink-700/60 hover:text-teal-300 active:scale-[0.98]",
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>{loadingText ?? "Working…"}</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
