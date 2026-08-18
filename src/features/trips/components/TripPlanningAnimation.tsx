import { Truck } from "lucide-react";

/** Shown while the plan-trip mutation is in flight — a branded moment for
 * what's usually the longest wait in the app (real routing + HOS math on
 * the backend), rather than a generic spinner. */
export function TripPlanningAnimation({ label = "Planning your trip…" }: { label?: string }) {
  return (
    <div className="animate-fade-up flex flex-col items-center gap-5 rounded-2xl border border-ink-700 bg-ink-800/40 py-10 shadow-panel">
      <div className="relative h-14 w-56">
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 animate-shimmer"
          style={{
            backgroundImage: "repeating-linear-gradient(to right, var(--color-ink-500) 0 10px, transparent 10px 22px)",
            backgroundSize: "200% 100%",
          }}
          aria-hidden
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-truck-bounce">
            <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-ink-950 shadow-glow">
              <Truck className="size-6" aria-hidden />
            </span>
          </div>
        </div>
      </div>
      <p className="font-display text-sm font-semibold tracking-wide text-ink-200" role="status" aria-live="polite">
        {label}
      </p>
    </div>
  );
}
