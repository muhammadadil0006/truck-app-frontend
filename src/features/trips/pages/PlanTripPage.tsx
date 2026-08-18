import { Spinner } from "../../../components/ui/Spinner";
import { TripForm } from "../components/TripForm";
import { TripResults } from "../components/TripResults";
import { usePlanTripMutation } from "../tripApi";

export function PlanTripPage() {
  const [planTrip, { data: trip, isLoading, isError, error }] = usePlanTripMutation();

  return (
    <div className="space-y-8">
      <div className="animate-fade-up max-w-2xl">
        <p className="font-display text-xs font-semibold tracking-[0.25em] text-teal-400 uppercase">
          Property-carrying · 70hr/8-day cycle
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">
          Plan an HOS-compliant route
        </h1>
        <p className="mt-2 text-sm text-ink-300">
          Enter the trip's stops and current cycle hours — Convoy routes it, schedules rests and fuel stops, and
          drafts the FMCSA daily logs for every day on the road.
        </p>
      </div>

      <TripForm
        onSubmit={(request) => void planTrip(request)}
        isLoading={isLoading}
        errorMessage={isError ? extractErrorMessage(error) : undefined}
      />

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner label="Planning your trip…" />
        </div>
      )}
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
