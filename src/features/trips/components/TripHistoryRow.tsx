import { Link } from "react-router-dom";
import { ArrowRight, Route as RouteIcon } from "lucide-react";
import clsx from "clsx";

import { formatMiles } from "../../../utils/format";
import { formatDate } from "../../../utils/time";
import type { TripListItem } from "../types";

export interface TripHistoryRowProps {
  trip: TripListItem;
}

/** Single trip link card in the history list. */
export function TripHistoryRow({ trip }: TripHistoryRowProps) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-ink-700 bg-ink-800/40 p-4 shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-glow"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={clsx(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-teal-300 transition-colors",
            "bg-teal-500/10 group-hover:bg-teal-500/15"
          )}
        >
          <RouteIcon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-50">
            {trip.pickup_location_text} <span className="text-ink-500">→</span> {trip.dropoff_location_text}
          </p>
          <p className="font-mono text-xs text-ink-400">{formatDate(trip.created_at)}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-mono text-sm text-ink-300">{formatMiles(trip.total_distance_miles)}</span>
        <ArrowRight
          className="size-4 text-ink-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-teal-300"
          aria-hidden
        />
      </div>
    </Link>
  );
}
