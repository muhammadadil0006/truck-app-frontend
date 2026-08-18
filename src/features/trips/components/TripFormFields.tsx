import type { Dispatch, SetStateAction } from "react";
import { MapPin, Navigation } from "lucide-react";

import type { TripFormErrors, TripFormState } from "../../../utils/validateTripForm";
import { CycleHoursInput } from "./CycleHoursInput";
import { LocationAutocomplete } from "./LocationAutocomplete";

export interface TripFormFieldsProps {
  form: TripFormState;
  setForm: Dispatch<SetStateAction<TripFormState>>;
  errors: TripFormErrors;
}

/** Location + cycle-hours inputs grid, shared by the trip planning form. */
export function TripFormFields({ form, setForm, errors }: TripFormFieldsProps) {
  return (
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
  );
}
