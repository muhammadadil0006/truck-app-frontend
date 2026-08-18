import { useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { validateTripForm, type TripFormErrors, type TripFormState } from "../../../utils/validateTripForm";
import { FormPanelBackdrop } from "./FormPanelBackdrop";
import { RouteWaypointsBreadcrumb } from "./RouteWaypointsBreadcrumb";
import { TripFormFields } from "./TripFormFields";
import type { PlanTripRequest } from "../types";

const INITIAL_STATE: TripFormState = {
  currentLocation: null,
  pickupLocation: null,
  dropoffLocation: null,
  cycleUsedHrs: "0",
};

const ROUTE_WAYPOINTS = ["Current", "Pickup", "Dropoff"];

export interface TripFormProps {
  onSubmit: (request: PlanTripRequest) => void;
  isLoading: boolean;
  errorMessage?: string;
}

/** Presentational form — the mutation hook lives in PlanTripPage so both the
 * form and the results section share the same call's isLoading/data/error
 * state (RTK Query mutation results are only readable from the hook
 * instance that triggered them, unless a fixedCacheKey is used). */
export function TripForm({ onSubmit, isLoading, errorMessage }: TripFormProps) {
  const [form, setForm] = useState<TripFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<TripFormErrors>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateTripForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      current_location_text: form.currentLocation!.text,
      current_location_lat: form.currentLocation!.lat,
      current_location_lng: form.currentLocation!.lng,
      pickup_location_text: form.pickupLocation!.text,
      pickup_location_lat: form.pickupLocation!.lat,
      pickup_location_lng: form.pickupLocation!.lng,
      dropoff_location_text: form.dropoffLocation!.text,
      dropoff_location_lat: form.dropoffLocation!.lat,
      dropoff_location_lng: form.dropoffLocation!.lng,
      cycle_used_hrs: Number(form.cycleUsedHrs),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-up relative space-y-5 rounded-2xl border border-ink-700 bg-ink-800/40 p-6 shadow-panel backdrop-blur-sm sm:p-7"
    >
      <FormPanelBackdrop />

      <RouteWaypointsBreadcrumb waypoints={ROUTE_WAYPOINTS} />

      <TripFormFields form={form} setForm={setForm} errors={errors} />

      {errorMessage && <ErrorBanner message={errorMessage} />}

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Planning trip…"
        className="relative w-full"
        icon={<Send className="size-4" aria-hidden />}
      >
        Plan Trip
      </Button>
    </form>
  );
}
