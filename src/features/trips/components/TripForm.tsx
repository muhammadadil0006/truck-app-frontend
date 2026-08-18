import { Fragment, useState } from "react";
import type { FormEvent } from "react";
import { MapPin, Navigation, Send } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { validateTripForm, type TripFormErrors, type TripFormState } from "../../../utils/validateTripForm";
import { CycleHoursInput } from "./CycleHoursInput";
import { LocationAutocomplete } from "./LocationAutocomplete";
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
    <form
      onSubmit={handleSubmit}
      className="animate-fade-up relative space-y-5 rounded-2xl border border-ink-700 bg-ink-800/40 p-6 shadow-panel backdrop-blur-sm sm:p-7"
    >
      {/* Decorative line texture (spotter.ai's diagonal-line motif), clipped
          to the card's own rounded corners — isolated in its own overflow
          layer so it never clips the location dropdowns rendered below. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />
      </div>

      {/* Route waypoint stepper — Current → Pickup → Dropoff, with an
          animated marching-dash connector echoing the trip's route line. */}
      <div className="relative flex items-center gap-2">
        {ROUTE_WAYPOINTS.map((label, i) => (
          <Fragment key={label}>
            <span className="flex shrink-0 items-center gap-1.5 font-display text-[10px] font-semibold tracking-widest text-teal-300/90 uppercase">
              <span className="size-1.5 rounded-full bg-teal-400 shadow-glow" aria-hidden />
              {label}
            </span>
            {i < ROUTE_WAYPOINTS.length - 1 && (
              <span
                className="h-px min-w-6 flex-1 animate-shimmer"
                style={{
                  backgroundImage: "repeating-linear-gradient(to right, var(--color-teal-500) 0 6px, transparent 6px 14px)",
                  backgroundSize: "200% 100%",
                }}
                aria-hidden
              />
            )}
          </Fragment>
        ))}
      </div>

      <div className="stagger relative grid gap-4 sm:grid-cols-2">
        <LocationAutocomplete
          id="currentLocation"
          label="Current location"
          placeholder="Start typing a city…"
          value={form.currentLocation}
          onChange={(loc) => setForm((prev) => ({ ...prev, currentLocation: loc }))}
          error={errors.currentLocation}
          icon={<Navigation className="size-4" aria-hidden />}
        />
        <LocationAutocomplete
          id="pickupLocation"
          label="Pickup location"
          placeholder="Start typing a city…"
          value={form.pickupLocation}
          onChange={(loc) => setForm((prev) => ({ ...prev, pickupLocation: loc }))}
          error={errors.pickupLocation}
          icon={<MapPin className="size-4" aria-hidden />}
        />
        <LocationAutocomplete
          id="dropoffLocation"
          label="Dropoff location"
          placeholder="Start typing a city…"
          value={form.dropoffLocation}
          onChange={(loc) => setForm((prev) => ({ ...prev, dropoffLocation: loc }))}
          error={errors.dropoffLocation}
          icon={<MapPin className="size-4" aria-hidden />}
          className="sm:col-span-2"
        />

        <CycleHoursInput
          id="cycleUsedHrs"
          value={form.cycleUsedHrs}
          onChange={(v) => setForm((prev) => ({ ...prev, cycleUsedHrs: v }))}
          error={errors.cycleUsedHrs}
        />
      </div>

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
