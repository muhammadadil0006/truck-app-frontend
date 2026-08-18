import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { Spinner } from "../../../components/ui/Spinner";
import { useListTripsQuery } from "../../../store/slices/tripApi";
import { TripHistoryEmptyState } from "../components/TripHistoryEmptyState";
import { TripHistoryHeader } from "../components/TripHistoryHeader";
import { TripHistoryRow } from "../components/TripHistoryRow";

export function TripHistoryPage() {
  const { data: trips, isLoading, isError } = useListTripsQuery();

  return (
    <div className="space-y-6">
      <TripHistoryHeader />

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner label="Loading trip history…" />
        </div>
      )}
      {isError && <ErrorBanner message="Couldn't load trip history." />}

      {trips && trips.length === 0 && <TripHistoryEmptyState />}

      <ul className="stagger space-y-2.5">
        {trips?.map((trip) => (
          <li key={trip.id}>
            <TripHistoryRow trip={trip} />
          </li>
        ))}
      </ul>
    </div>
  );
}
