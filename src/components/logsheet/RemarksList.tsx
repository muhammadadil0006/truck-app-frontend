import { DutyStatus } from "../../constants/dutyStatus";
import type { LogSegment } from "../../features/trips/types";
import { formatTime } from "../../utils/time";

/** engine.py tags the meaningful stop types directly (Pickup, Dropoff, Fuel
 * stop, 30-minute break, 10-hour rest, 34-hour restart, Trip complete) via
 * seg.remarks. Plain driving/off-duty segments carry no tag — fall back to
 * a status-based description so every entry in the list explains itself,
 * not just the tagged ones. */
function describe(seg: LogSegment): string {
  if (seg.remarks) return seg.remarks;
  if (seg.status === DutyStatus.Driving) return "Driving";
  if (seg.status === DutyStatus.OffDuty) return "Off duty";
  if (seg.status === DutyStatus.SleeperBerth) return "Sleeper berth";
  return "On duty";
}

/** One entry per duty-status change, per CLAUDE.md's Remarks-section spec:
 * city/town/state (or highway/milepost) logged at every status change. */
export function RemarksList({ segments }: { segments: LogSegment[] }) {
  if (segments.length === 0) return null;

  return (
    <ul className="space-y-1 text-sm">
      {segments.map((seg, i) => (
        <li key={`${seg.start_time}-${i}`}>
          <span className="text-gray-500">{formatTime(seg.start_time)}</span> — {describe(seg)}
          {seg.location_text && <span className="text-gray-500">, {seg.location_text}</span>}
        </li>
      ))}
    </ul>
  );
}
