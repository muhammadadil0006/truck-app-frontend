import type { DutyStatus } from "../../constants/dutyStatus";
import type { StopType } from "../../constants/stopTypes";

/** A place picked from LocationAutocomplete's suggestion dropdown — text and
 * coordinates always travel together so the point the user saw is exactly
 * the point submitted (see services/routing/client.py on the backend for
 * why this replaced free-text geocoding). */
export interface ResolvedLocation {
  text: string;
  lat: number;
  lng: number;
}

/** One row from GET /api/geocode/?q=... */
export interface GeocodeSuggestion {
  label: string;
  lat: number;
  lng: number;
}

/** POST /api/trips/ request body. */
export interface PlanTripRequest {
  current_location_text: string;
  current_location_lat: number;
  current_location_lng: number;
  pickup_location_text: string;
  pickup_location_lat: number;
  pickup_location_lng: number;
  dropoff_location_text: string;
  dropoff_location_lat: number;
  dropoff_location_lng: number;
  cycle_used_hrs: number;
}

export interface Stop {
  type: StopType;
  location_text: string;
  lat: number;
  lng: number;
  arrival: string; // ISO 8601
  departure: string; // ISO 8601
}

export interface LogSegment {
  status: DutyStatus;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  location_text: string;
  lat: number;
  lng: number;
  remarks: string;
}

/** One duty-status change. Unlike LogSegment, this is computed on the raw
 * pre-midnight-split segment list on the backend — a segment that merely
 * crosses midnight without its status changing (e.g. an overnight 10-hr
 * reset) is NOT a transition. Use this (not adjacent LogSegments) to place
 * the grid's row-change dots and Remarks entries, so a day that starts
 * mid-reset doesn't show a spurious change at midnight. */
export interface Transition {
  time: string; // ISO 8601
  from_status: DutyStatus | null; // null only for the very first transition of the trip
  to_status: DutyStatus;
  location_text: string;
  lat: number;
  lng: number;
  remarks: string;
}

export interface DailyLog {
  day_index: number;
  log_date: string; // "YYYY-MM-DD"
  total_driving_hours: number;
  total_on_duty_hours: number;
  total_off_duty_hours: number;
  total_sleeper_berth_hours: number;
  total_miles_today: number;
  recap_a_last_7_days: number;
  recap_b_available_tomorrow: number;
  recap_c_last_8_days_if_restart: number;
  segments: LogSegment[];
  transitions: Transition[];
}

export type TripStatus = "completed" | "failed";

/** Full trip resource — GET /api/trips/<id>/ and the response of POST /api/trips/. */
export interface Trip {
  id: string;
  current_location_text: string;
  current_location_lat: number;
  current_location_lng: number;
  pickup_location_text: string;
  pickup_location_lat: number;
  pickup_location_lng: number;
  dropoff_location_text: string;
  dropoff_location_lat: number;
  dropoff_location_lng: number;
  cycle_used_hrs: number;
  total_distance_miles: number | null;
  total_duration_hours: number | null;
  route_geometry: [number, number][]; // GeoJSON [lng, lat] pairs
  stops: Stop[];
  status: TripStatus;
  error_message: string;
  created_at: string; // ISO 8601
  daily_logs: DailyLog[];
}

/** Lightweight shape for GET /api/trips/ (history list). */
export interface TripListItem {
  id: string;
  current_location_text: string;
  pickup_location_text: string;
  dropoff_location_text: string;
  total_distance_miles: number | null;
  status: TripStatus;
  created_at: string;
}
