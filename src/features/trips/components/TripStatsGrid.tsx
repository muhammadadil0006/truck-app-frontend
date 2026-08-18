import { CalendarDays, Clock, Route as RouteIcon, type LucideIcon } from "lucide-react";

import { formatHours, formatMiles } from "../../../utils/format";
import type { Trip } from "../types";

interface Stat {
  icon: LucideIcon;
  label: string;
  value: string;
}

function statsFor(trip: Trip): Stat[] {
  return [
    { icon: RouteIcon, label: "Total distance", value: formatMiles(trip.total_distance_miles) },
    { icon: Clock, label: "Drive + duty time", value: formatHours(trip.total_duration_hours) },
    { icon: CalendarDays, label: "Log sheet days", value: `${trip.daily_logs.length}` },
  ];
}

function StatCard({ icon: Icon, label, value }: Stat) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/40 px-4 py-3.5 shadow-panel">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-300">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium tracking-wide text-ink-400 uppercase">{label}</p>
        <p className="font-mono text-lg font-semibold text-ink-50">{value}</p>
      </div>
    </div>
  );
}

/** Distance / duration / log-sheet-count summary cards for a Trip. */
export function TripStatsGrid({ trip }: { trip: Trip }) {
  return (
    <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-3">
      {statsFor(trip).map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
