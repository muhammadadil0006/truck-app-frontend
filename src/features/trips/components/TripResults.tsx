import { CalendarDays, Clock, Route as RouteIcon } from "lucide-react";

import { MapLegend } from "../../../components/map/MapLegend";
import { RouteMap } from "../../../components/map/RouteMap";
import { LogSheetPager } from "../../../components/logsheet/LogSheetPager";
import { formatHours, formatMiles } from "../../../utils/format";
import type { Trip } from "../types";

const STATS = (trip: Trip) => [
  { icon: RouteIcon, label: "Total distance", value: formatMiles(trip.total_distance_miles) },
  { icon: Clock, label: "Drive + duty time", value: formatHours(trip.total_duration_hours) },
  { icon: CalendarDays, label: "Log sheet days", value: `${trip.daily_logs.length}` },
];

/** Composes the map + log-sheet pager for one Trip. Reused by both
 * PlanTripPage (fresh mutation result) and TripDetailPage (fetched by id) —
 * both ultimately just render a Trip regardless of where it came from. */
export function TripResults({ trip }: { trip: Trip }) {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STATS(trip).map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/40 px-4 py-3.5 shadow-panel"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-300">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium tracking-wide text-ink-400 uppercase">{label}</p>
              <p className="font-mono text-lg font-semibold text-ink-50">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-ink-700 shadow-panel">
          <RouteMap routeGeometry={trip.route_geometry} stops={trip.stops} />
        </div>
        <MapLegend />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold tracking-wide text-ink-50">Daily Logs</h2>
        <LogSheetPager trip={trip} />
      </div>
    </div>
  );
}
