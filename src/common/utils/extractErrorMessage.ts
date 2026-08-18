/** Pulls a human-readable message out of an RTK Query error shape (the
 * `{ data: { detail } }` envelope our Django backend returns), falling back
 * to a generic message for anything else (network errors, serialization
 * errors, etc). */
export function extractErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { detail?: string } }).data;
    if (data?.detail) return data.detail;
  }
  return fallback;
}
