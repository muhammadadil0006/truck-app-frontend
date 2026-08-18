import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";

/** Shown on the history page when the driver hasn't planned any trips yet. */
export function TripHistoryEmptyState() {
  return (
    <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-600 py-16 text-center">
      <Inbox className="size-8 text-ink-500" aria-hidden />
      <p className="text-sm text-ink-300">No trips planned yet.</p>
      <Link
        to="/"
        className="mt-1 font-display text-xs font-semibold tracking-wide text-teal-300 uppercase hover:text-teal-200"
      >
        Plan your first trip →
      </Link>
    </div>
  );
}
