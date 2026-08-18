import { useParams } from "react-router-dom";

import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { TripDetailHeader } from "../components/TripDetailHeader";
import { TripPlanningAnimation } from "../components/TripPlanningAnimation";
import { TripResults } from "../components/TripResults";
import { useGetTripQuery } from "../../../store/slices/tripApi";

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading, isError } = useGetTripQuery(id ?? "", { skip: !id });

  return (
    <div className="space-y-6">
      <TripDetailHeader />

      {isLoading && <TripPlanningAnimation label="Loading trip…" />}
      {isError && <ErrorBanner message="Trip not found." />}
      {trip && <TripResults trip={trip} />}
    </div>
  );
}
