import { STOP_TYPE_STYLE } from "../../constants/stopTypes";
import type { Stop } from "../../features/trips/types";
import { formatDateTime } from "../../utils/time";

export function StopPopupContent({ stop }: { stop: Stop }) {
  const { label } = STOP_TYPE_STYLE[stop.type];
  return (
    <div className="text-sm">
      <p className="font-semibold">{label}</p>
      <p>{stop.location_text}</p>
      <p className="text-gray-500">
        Arrive {formatDateTime(stop.arrival)} · Depart {formatDateTime(stop.departure)}
      </p>
    </div>
  );
}
