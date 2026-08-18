import { STOP_TYPE_STYLE } from "../../constants/stopTypes";
import type { Stop } from "../../features/trips/types";
import { formatDateTime } from "../../utils/time";

export function StopPopupContent({ stop }: { stop: Stop }) {
  const { label, color } = STOP_TYPE_STYLE[stop.type];
  return (
    <div className="min-w-[10rem] font-body text-sm">
      <p className="flex items-center gap-1.5 font-display font-semibold text-ink-50">
        <span className="size-2 rounded-full" style={{ background: color }} aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-ink-200">{stop.location_text}</p>
      <p className="mt-1 font-mono text-xs text-ink-400">
        Arrive {formatDateTime(stop.arrival)}
        <br />
        Depart {formatDateTime(stop.departure)}
      </p>
    </div>
  );
}
