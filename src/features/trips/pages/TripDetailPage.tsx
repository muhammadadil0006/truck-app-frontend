import { Link, useParams } from "react-router-dom";

import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { Spinner } from "../../../components/ui/Spinner";
import { TripResults } from "../components/TripResults";
import { useGetTripQuery } from "../tripApi";

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading, isError } = useGetTripQuery(id ?? "", { skip: !id });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip Detail</h1>
        <Link to="/history" className="text-sm text-blue-600 hover:underline">
          Back to history
        </Link>
      </div>

      {isLoading && <Spinner label="Loading trip…" />}
      {isError && <ErrorBanner message="Trip not found." />}
      {trip && <TripResults trip={trip} />}
    </div>
  );
}
