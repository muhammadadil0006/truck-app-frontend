import { MapLegend } from "../../../components/map/MapLegend";
import { RouteMap } from "../../../components/map/RouteMap";
import { LogSheetPager } from "../../../components/logsheet/LogSheetPager";
import { TripStatsGrid } from "./TripStatsGrid";
import type { Trip } from "../types";

/** Composes the map + log-sheet pager for one Trip. Reused by both
 * PlanTripPage (fresh mutation result) and TripDetailPage (fetched by id) —
 * both ultimately just render a Trip regardless of where it came from. */
export function TripResults({ trip }: { trip: Trip }) {
  return (
    <div className="animate-fade-up space-y-6">
      <TripStatsGrid trip={trip} />

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
