import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface TripFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export function TripFormField({ label, error, helperText, icon, id, className, ...rest }: TripFormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-display text-xs font-semibold tracking-wider text-ink-300 uppercase">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400 peer-focus:text-teal-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={clsx(
            "peer w-full rounded-xl border bg-ink-800/60 py-2.5 text-sm text-ink-50 placeholder:text-ink-400/70 transition-all duration-200 focus:bg-ink-800 focus:outline-none",
            icon ? "pr-3 pl-10" : "px-3",
            error
              ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-ink-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20",
            className
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : (
        helperText && <p className="mt-1.5 text-xs text-ink-400">{helperText}</p>
      )}
    </div>
  );
}
