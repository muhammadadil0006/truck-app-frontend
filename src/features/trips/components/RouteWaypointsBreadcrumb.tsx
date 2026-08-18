import { Fragment } from "react";

export interface RouteWaypointsBreadcrumbProps {
  waypoints: string[];
}

/** Current → Pickup → Dropoff style breadcrumb with an animated shimmer connector. */
export function RouteWaypointsBreadcrumb({ waypoints }: RouteWaypointsBreadcrumbProps) {
  return (
    <div className="relative flex items-center gap-2">
      {waypoints.map((label, i) => (
        <Fragment key={label}>
          <span className="flex shrink-0 items-center gap-1.5 font-display text-[10px] font-semibold tracking-widest text-teal-300/90 uppercase">
            <span className="size-1.5 rounded-full bg-teal-400 shadow-glow" aria-hidden />
            {label}
          </span>
          {i < waypoints.length - 1 && (
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
  );
}
