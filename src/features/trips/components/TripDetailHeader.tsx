import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** Back-to-history link + title for the trip detail page. */
export function TripDetailHeader() {
  return (
    <div className="animate-fade-up flex items-center justify-between gap-4">
      <div>
        <Link
          to="/history"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-teal-300"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to history
        </Link>
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-50">Trip Detail</h1>
      </div>
    </div>
  );
}
