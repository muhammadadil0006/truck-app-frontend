import { useNavigate } from "react-router-dom";

import { HosRulesPanel } from "../components/HosRulesPanel";
import { TripForm } from "../components/TripForm";
import { TripPlanningAnimation } from "../components/TripPlanningAnimation";
import { usePlanTripMutation } from "../tripApi";
import type { PlanTripRequest } from "../types";

/** Create-only page — planning a trip navigates to its own view route
 * (TripDetailPage, /trips/:id) rather than rendering results inline here,
 * so "create" and "view" stay separate pages instead of one page doing
 * both jobs. */
export function PlanTripPage() {
  const navigate = useNavigate();
  const [planTrip, { isLoading, isError, error }] = usePlanTripMutation();

  function handleSubmit(request: PlanTripRequest) {
    planTrip(request)
      .unwrap()
      .then((trip) => navigate(`/trips/${trip.id}`))
      .catch(() => {
        // Surfaced via isError/error below — nothing further to do here.
      });
  }

  return (
    <div className="space-y-8">
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <div className="space-y-6">
          <div className="animate-fade-up">
            <p className="font-display text-xs font-semibold tracking-[0.25em] text-teal-400 uppercase">
              Property-carrying · 70hr/8-day cycle
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-50 sm:text-5xl">
              Plan an HOS-compliant route
            </h1>
            <p className="mt-2 text-sm text-ink-300">
              Tell us where you're starting, picking up, and dropping off. We'll map your route, build in rest and
              fuel stops, and hand you FMCSA-ready daily logs — done in seconds.
            </p>
          </div>

          {isLoading ? (
            <TripPlanningAnimation />
          ) : (
            <TripForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              errorMessage={isError ? extractErrorMessage(error) : undefined}
            />
          )}
        </div>

        <HosRulesPanel />
      </div>
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
