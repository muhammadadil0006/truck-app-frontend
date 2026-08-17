import { RouteMap } from "../../../components/map/RouteMap";
import { LogSheetPager } from "../../../components/logsheet/LogSheetPager";
import { formatHours, formatMiles } from "../../../utils/format";
import type { Trip } from "../types";

/** Composes the map + log-sheet pager for one Trip. Reused by both
 * PlanTripPage (fresh mutation result) and TripDetailPage (fetched by id) —
 * both ultimately just render a Trip regardless of where it came from. */
export function TripResults({ trip }: { trip: Trip }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>{formatMiles(trip.total_distance_miles)}</span>
        <span>{formatHours(trip.total_duration_hours)}</span>
        <span>{trip.daily_logs.length} day(s)</span>
      </div>

      <RouteMap routeGeometry={trip.route_geometry} stops={trip.stops} />

      <div>
        <h2 className="mb-2 text-lg font-semibold">Daily Logs</h2>
        <LogSheetPager trip={trip} />
      </div>
    </div>
  );
}
