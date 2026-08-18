const STORAGE_KEY = "eld_trip_planner_guest_id";

/**
 * Client-generated id scoping trip history to this browser — no server
 * sessions or auth involved (see backend's trips/views.py X-Guest-Id
 * handling). Generated once and persisted in localStorage; every tripApi
 * request attaches it via fetchBaseQuery's prepareHeaders.
 */
export function getGuestId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const created = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, created);
  return created;
}
