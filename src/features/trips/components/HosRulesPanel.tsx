import { BedDouble, Clock, Coffee, Gauge, RotateCcw } from "lucide-react";

import {
  BREAK_REQUIRED_AFTER_HOURS,
  DRIVING_LIMIT_HOURS,
  DRIVING_WINDOW_HOURS,
  MAX_CYCLE_HOURS,
  RESTART_HOURS,
} from "../../../constants/hos";

const RULES = [
  {
    icon: Gauge,
    value: `${DRIVING_LIMIT_HOURS}h`,
    label: "Driving limit",
    detail: "Max hours behind the wheel before a 10-hr break.",
  },
  {
    icon: Clock,
    value: `${DRIVING_WINDOW_HOURS}h`,
    label: "Duty window",
    detail: "All driving must finish inside this window from shift start.",
  },
  {
    icon: Coffee,
    value: "30m",
    label: "Required break",
    detail: `After ${BREAK_REQUIRED_AFTER_HOURS} cumulative driving hours.`,
  },
  {
    icon: RotateCcw,
    value: `${MAX_CYCLE_HOURS}h`,
    label: "8-day cycle",
    detail: "Rolling on-duty total — driving stops once reached.",
  },
  {
    icon: BedDouble,
    value: `${RESTART_HOURS}h`,
    label: "Full restart",
    detail: "Consecutive hours off duty to zero out the cycle.",
  },
];

/** Static regulatory reference — right rail alongside the trip form. Purely
 * informational (never fed into the actual planning math, which lives
 * server-side); ties the form to the "why" behind its cycle-hours input. */
export function HosRulesPanel() {
  return (
    <aside className="animate-fade-up rounded-2xl border border-ink-700 bg-ink-800/40 p-6 shadow-panel backdrop-blur-sm lg:sticky lg:top-24">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase">FMCSA Rules</p>
      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-50">Know your limits</h2>
      <p className="mt-1 text-xs text-ink-400">The federal driving rules Convoy checks every trip against.</p>

      <ul className="stagger mt-5 space-y-4">
        {RULES.map(({ icon: Icon, value, label, detail }) => (
          <li key={label} className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-300 mt-1">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-semibold text-ink-50">{value}</span>
                <span className="font-display text-sm font-medium tracking-wide text-ink-200">{label}</span>
              </p>
              <p className="text-xs text-ink-400">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
