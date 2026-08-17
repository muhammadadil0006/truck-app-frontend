import { Link } from "react-router-dom";

import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { Spinner } from "../../../components/ui/Spinner";
import { formatMiles } from "../../../utils/format";
import { formatDate } from "../../../utils/time";
import { useListTripsQuery } from "../tripApi";

export function TripHistoryPage() {
  const { data: trips, isLoading, isError } = useListTripsQuery();

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip History</h1>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          Plan a new trip
        </Link>
      </div>

      {isLoading && <Spinner label="Loading trip history…" />}
      {isError && <ErrorBanner message="Couldn't load trip history." />}
      {trips && trips.length === 0 && <p className="text-gray-500">No trips planned yet.</p>}

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {trips?.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`} className="flex items-center justify-between p-3 hover:bg-gray-50">
              <div>
                <p className="font-medium">
                  {trip.pickup_location_text} → {trip.dropoff_location_text}
                </p>
                <p className="text-xs text-gray-500">{formatDate(trip.created_at)}</p>
              </div>
              <span className="text-sm text-gray-500">{formatMiles(trip.total_distance_miles)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
