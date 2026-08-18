import { Link } from "react-router-dom";
import { ArrowRight, Inbox, Route as RouteIcon } from "lucide-react";
import clsx from "clsx";

import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { Spinner } from "../../../components/ui/Spinner";
import { formatMiles } from "../../../utils/format";
import { formatDate } from "../../../utils/time";
import { useListTripsQuery } from "../tripApi";

export function TripHistoryPage() {
  const { data: trips, isLoading, isError } = useListTripsQuery();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <p className="font-display text-xs font-semibold tracking-[0.25em] text-teal-400 uppercase">Logbook</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-50">Trip History</h1>
        <p className="mt-2 text-sm text-ink-300">Every trip plan you've generated, with its logs a click away.</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner label="Loading trip history…" />
        </div>
      )}
      {isError && <ErrorBanner message="Couldn't load trip history." />}

      {trips && trips.length === 0 && (
        <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-600 py-16 text-center">
          <Inbox className="size-8 text-ink-500" aria-hidden />
          <p className="text-sm text-ink-300">No trips planned yet.</p>
          <Link
            to="/"
            className="mt-1 font-display text-xs font-semibold tracking-wide text-teal-300 uppercase hover:text-teal-200"
          >
            Plan your first trip →
          </Link>
        </div>
      )}

      <ul className="stagger space-y-2.5">
        {trips?.map((trip) => (
          <li key={trip.id}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
