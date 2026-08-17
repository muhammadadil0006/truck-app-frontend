/**
 * Duplicated from the backend's 70-hour/8-day rule, for client-side input
 * bounds-checking and recap-box progress display ONLY. The API is the
 * source of truth for all actual HOS math — never recompute rules here.
 */
export const MAX_CYCLE_HOURS = 70;
