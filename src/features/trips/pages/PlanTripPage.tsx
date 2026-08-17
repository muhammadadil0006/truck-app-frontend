import { Link } from "react-router-dom";

import { Spinner } from "../../../components/ui/Spinner";
import { TripForm } from "../components/TripForm";
import { TripResults } from "../components/TripResults";
import { usePlanTripMutation } from "../tripApi";

export function PlanTripPage() {
  const [planTrip, { data: trip, isLoading, isError, error }] = usePlanTripMutation();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">ELD Trip Planner</h1>
        <Link to="/history" className="text-sm text-blue-600 hover:underline">
          Trip History
        </Link>
      </div>

      <TripForm
        onSubmit={(request) => void planTrip(request)}
        isLoading={isLoading}
        errorMessage={isError ? extractErrorMessage(error) : undefined}
      />

      {isLoading && <Spinner label="Planning your trip…" />}
      {trip && <TripResults trip={trip} />}
    </div>
  );
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { detail?: string } }).data;
    if (data?.detail) return data.detail;
  }
  return "Something went wrong planning this trip. Please try again.";
}
