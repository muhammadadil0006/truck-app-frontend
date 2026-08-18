/**
 * Duplicated from the backend's 70-hour/8-day rule, for client-side input
 * bounds-checking and recap-box progress display ONLY. The API is the
 * source of truth for all actual HOS math — never recompute rules here.
 */
export const MAX_CYCLE_HOURS = 70;

// Display-only constants for the HOS quick-reference panel — same caveat as
// above, never used for actual trip-planning math.
export const DRIVING_LIMIT_HOURS = 11;
export const DRIVING_WINDOW_HOURS = 14;
export const BREAK_REQUIRED_AFTER_HOURS = 8;
export const RESTART_HOURS = 34;
