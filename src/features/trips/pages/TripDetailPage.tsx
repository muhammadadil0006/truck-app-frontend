import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { Spinner } from "../../../components/ui/Spinner";
import { TripResults } from "../components/TripResults";
import { useGetTripQuery } from "../tripApi";

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading, isError } = useGetTripQuery(id ?? "", { skip: !id });

  return (
    <div className="space-y-6">
      <div className="animate-fade-up flex items-center justify-between gap-4">
        <div>
          <Link
            to="/history"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-teal-300"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to history
          </Link>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-50">Trip Detail</h1>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner label="Loading trip…" />
        </div>
      )}
      {isError && <ErrorBanner message="Trip not found." />}
      {trip && <TripResults trip={trip} />}
    </div>
  );
}
