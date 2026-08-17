import { MAX_CYCLE_HOURS } from "../constants/hos";
import type { ResolvedLocation } from "../features/trips/types";

export interface TripFormState {
  currentLocation: ResolvedLocation | null;
  pickupLocation: ResolvedLocation | null;
  dropoffLocation: ResolvedLocation | null;
  cycleUsedHrs: string; // raw input value; parsed to number on submit
}

export type TripFormErrors = Partial<Record<keyof TripFormState, string>>;

const SELECT_SUGGESTION_ERROR = "Select a location from the suggestions.";

export function validateTripForm(form: TripFormState): TripFormErrors {
  const errors: TripFormErrors = {};

  if (!form.currentLocation) errors.currentLocation = SELECT_SUGGESTION_ERROR;
  if (!form.pickupLocation) errors.pickupLocation = SELECT_SUGGESTION_ERROR;
  if (!form.dropoffLocation) errors.dropoffLocation = SELECT_SUGGESTION_ERROR;

  const cycleUsed = Number(form.cycleUsedHrs);
  if (form.cycleUsedHrs.trim() === "" || Number.isNaN(cycleUsed)) {
    errors.cycleUsedHrs = "Enter the hours already used in the current cycle.";
  } else if (cycleUsed < 0 || cycleUsed > MAX_CYCLE_HOURS) {
    errors.cycleUsedHrs = `Must be between 0 and ${MAX_CYCLE_HOURS}.`;
  }

  return errors;
}
