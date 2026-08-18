import { Truck } from "lucide-react";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="animate-fade-in flex items-center gap-3 text-sm text-ink-300" role="status" aria-live="polite">
      <div className="relative size-7 shrink-0">
        <div className="absolute inset-0 rounded-full border-2 border-ink-600 border-t-teal-400 animate-spin" />
        <Truck className="absolute inset-0 m-auto size-3.5 text-teal-300" aria-hidden />
      </div>
      <span className="font-display tracking-wide">{label}</span>
    </div>
  );
}
