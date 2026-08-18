import { DUTY_STATUS_COLOR, DutyStatus } from "../../constants/dutyStatus";
import type { Transition } from "../../features/trips/types";
import { formatTime } from "../../utils/time";

/** engine.py tags the meaningful stop types directly (Pickup, Dropoff, Fuel
 * stop, 30-minute break, 10-hour rest, 34-hour restart, Trip complete) via
 * the transition's remarks. Plain driving/off-duty transitions carry no
 * tag — fall back to a status-based description so every entry in the list
 * explains itself, not just the tagged ones. */
function describe(t: Transition): string {
  if (t.remarks) return t.remarks;
  if (t.to_status === DutyStatus.Driving) return "Driving";
  if (t.to_status === DutyStatus.OffDuty) return "Off duty";
  if (t.to_status === DutyStatus.SleeperBerth) return "Sleeper berth";
  return "On duty";
}

/** One entry per duty-status change, per CLAUDE.md's Remarks-section spec:
 * city/town/state (or highway/milepost) logged at every status change.
 * Driven by the backend's explicit transitions list (not segments) so a
 * day that opens mid-reset doesn't get a spurious blank entry at
 * Midnight — see Transition's doc comment in features/trips/types.ts. */
export function RemarksList({ transitions }: { transitions: Transition[] }) {
  if (transitions.length === 0) return null;

  return (
    <ul className="space-y-1.5 text-sm">
      {transitions.map((t, i) => (
        <li key={`${t.time}-${i}`} className="flex items-baseline gap-2">
          <span
            className="mt-1 size-1.5 shrink-0 rounded-full"
            style={{ background: DUTY_STATUS_COLOR[t.to_status] }}
            aria-hidden
          />
          <span className="font-mono text-xs text-ink-500">{formatTime(t.time)}</span>
          <span className="text-ink-900">
            {describe(t)}
            {t.location_text && <span className="text-ink-500">, {t.location_text}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
