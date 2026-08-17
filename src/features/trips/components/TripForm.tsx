import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "../../../components/ui/Button";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { MAX_CYCLE_HOURS } from "../../../constants/hos";
import { validateTripForm, type TripFormErrors, type TripFormState } from "../../../utils/validateTripForm";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { TripFormField } from "./TripFormField";
import type { PlanTripRequest } from "../types";

const INITIAL_STATE: TripFormState = {
  currentLocation: null,
  pickupLocation: null,
  dropoffLocation: null,
  cycleUsedHrs: "",
};

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

    // Non-null assertions are safe here: validateTripForm already rejected
    // any null location above.
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <LocationAutocomplete
        id="currentLocation"
        label="Current location"
        placeholder="Start typing a city…"
        value={form.currentLocation}
        onChange={(loc) => setForm((prev) => ({ ...prev, currentLocation: loc }))}
        error={errors.currentLocation}
      />
      <LocationAutocomplete
        id="pickupLocation"
        label="Pickup location"
        placeholder="Start typing a city…"
        value={form.pickupLocation}
        onChange={(loc) => setForm((prev) => ({ ...prev, pickupLocation: loc }))}
        error={errors.pickupLocation}
      />
      <LocationAutocomplete
        id="dropoffLocation"
        label="Dropoff location"
        placeholder="Start typing a city…"
        value={form.dropoffLocation}
        onChange={(loc) => setForm((prev) => ({ ...prev, dropoffLocation: loc }))}
        error={errors.dropoffLocation}
      />
      <TripFormField
        id="cycleUsedHrs"
        label="Current cycle used (hrs)"
        type="number"
        min={0}
        max={MAX_CYCLE_HOURS}
        step={0.5}
        placeholder="e.g. 10"
        value={form.cycleUsedHrs}
        onChange={(e) => setForm((prev) => ({ ...prev, cycleUsedHrs: e.target.value }))}
        error={errors.cycleUsedHrs}
        helperText={`Hours you've already logged on-duty in your rolling ${MAX_CYCLE_HOURS}-hour/8-day cycle. Once this trip pushes your total past ${MAX_CYCLE_HOURS}, a mandatory 34-hour restart is scheduled automatically.`}
      />

      {errorMessage && <ErrorBanner message={errorMessage} />}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Plan Trip
      </Button>
    </form>
  );
}
