import { useNavigate } from "react-router-dom";

import { extractErrorMessage } from "../../../common/utils/extractErrorMessage";
import { HosRulesPanel } from "../components/HosRulesPanel";
import { PlanTripHero } from "../components/PlanTripHero";
import { TripForm } from "../components/TripForm";
import { TripPlanningAnimation } from "../components/TripPlanningAnimation";
import { usePlanTripMutation } from "../../../store/slices/tripApi";
import type { PlanTripRequest } from "../types";

const ERROR_FALLBACK = "Something went wrong planning this trip. Please try again.";

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
          <PlanTripHero />

          {isLoading ? (
            <TripPlanningAnimation />
          ) : (
            <TripForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              errorMessage={isError ? extractErrorMessage(error, ERROR_FALLBACK) : undefined}
            />
          )}
        </div>

        <HosRulesPanel />
      </div>
    </div>
  );
}
