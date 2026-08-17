import type { LogSegment } from "../../features/trips/types";
import { formatTime } from "../../utils/time";

/** One entry per duty-status change, per CLAUDE.md's Remarks-section spec:
 * city/town/state (or highway/milepost) logged at every status change. */
export function RemarksList({ segments }: { segments: LogSegment[] }) {
  if (segments.length === 0) return null;

  return (
    <ul className="space-y-1 text-sm">
      {segments.map((seg, i) => (
        <li key={`${seg.start_time}-${i}`}>
          <span className="text-gray-500">{formatTime(seg.start_time)}</span>{" "}
          — {seg.location_text}
          {seg.remarks && <span className="text-gray-500"> ({seg.remarks})</span>}
        </li>
      ))}
    </ul>
  );
}
