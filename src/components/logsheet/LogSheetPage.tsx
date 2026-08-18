import { useMemo } from "react";

import { SHOW_DEBUG_PANEL } from "../../constants/debug";
import { DutyStatus } from "../../constants/dutyStatus";
import { MAX_CYCLE_HOURS, RESTART_HOURS } from "../../constants/hos";
import { LOG_SHEET_DEFAULTS } from "../../constants/logSheetDefaults";
import type { DailyLog, Trip } from "../../features/trips/types";
import { formatDate } from "../../utils/time";
import { LogSheetGrid } from "./LogSheetGrid";
import { RemarksList } from "./RemarksList";
import { TransitionsDebugPanel } from "./TransitionsDebugPanel";

export interface LogSheetPageProps {
  trip: Trip;
  dailyLog: DailyLog;
}

/** One full ELD log sheet: header fields + grid + remarks, per CLAUDE.md's
 * "Daily Log Sheet — Required Fields & Layout" section. Rendered as a literal
 * white paper sheet — deliberate contrast against the app's dark shell — to
 * read as an authentic DOT-inspectable document rather than another UI card. */
export function LogSheetPage({ trip, dailyLog }: LogSheetPageProps) {
  const totals = {
    [DutyStatus.OffDuty]: dailyLog.total_off_duty_hours,
    [DutyStatus.SleeperBerth]: dailyLog.total_sleeper_berth_hours,
    [DutyStatus.Driving]: dailyLog.total_driving_hours,
    [DutyStatus.OnDutyNotDriving]: dailyLog.total_on_duty_hours,
  };

  // Flattened once per trip: every day's transitions, in chronological
  // order, so a status spanning multiple calendar days (e.g. a 34-hour
  // restart) still clips correctly on each day it touches — see
  // logSheetGeometry.buildDayLines.
  const allTransitions = useMemo(
    () => trip.daily_logs.flatMap((log) => log.transitions),
    [trip.daily_logs]
  );

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="min-w-0 flex-1 rounded-2xl border border-ink-700 bg-ink-800/30 p-3 shadow-panel sm:p-4">
        <div className="space-y-4 rounded-xl bg-white p-4 text-ink-900 shadow-paper sm:p-5">
          {/* Header fields */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-ink-200 pb-3 text-sm sm:grid-cols-2">
            <div>
              <p className="font-display font-bold text-ink-900">
                Driver's Daily Log — {formatDate(dailyLog.log_date)}
              </p>
              <p className="text-ink-500">
                {trip.pickup_location_text} → {trip.dropoff_location_text}
              </p>
              <p className="text-ink-500">Carrier: {LOG_SHEET_DEFAULTS.carrierName}</p>
              <p className="text-ink-500">Main office: {LOG_SHEET_DEFAULTS.mainOfficeAddress}</p>
              <p className="text-ink-500">Shipping doc no.: {LOG_SHEET_DEFAULTS.shippingDocNumber}</p>
            </div>
            <div className="font-mono text-xs text-ink-500 sm:text-right">
              <p>Vehicle: {LOG_SHEET_DEFAULTS.truckTrailerNumber}</p>
              <p>Total miles driving today: {dailyLog.total_miles_today} mi</p>
              <p>Total mileage today: Not tracked</p>
              <p>Driver: {LOG_SHEET_DEFAULTS.driverName} (certified true and correct)</p>
              <p>Co-driver: {LOG_SHEET_DEFAULTS.coDriverName || "None"}</p>
              <p>Time zone: {LOG_SHEET_DEFAULTS.homeTerminalTimeZone}</p>
            </div>
          </div>

          <div className="-mx-1 overflow-x-auto px-1">
            <div className="min-w-[640px]">
              <LogSheetGrid allTransitions={allTransitions} logDate={dailyLog.log_date} totals={totals} />
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-ink-500 uppercase">
              Remarks (pickup, dropoff, breaks, rest, fuel, and location at every duty-status change)
            </p>
            <RemarksList transitions={dailyLog.transitions} />
          </div>

          <RecapBoxes dailyLog={dailyLog} />
        </div>
      </div>

      {SHOW_DEBUG_PANEL && <TransitionsDebugPanel transitions={dailyLog.transitions} />}
    </div>
  );
}

/** Recap boxes per CLAUDE.md's 70/8-day schedule spec — on-duty hours today,
 * plus the A/B/C rolling-window figures the backend already computes. */
function RecapBoxes({ dailyLog }: { dailyLog: DailyLog }) {
  const onDutyToday = dailyLog.total_driving_hours + dailyLog.total_on_duty_hours;
  const boxes = [
    { label: "On duty today", value: onDutyToday },
    { label: "A. Last 7 days incl. today", value: dailyLog.recap_a_last_7_days },
    { label: "B. Available tomorrow", value: dailyLog.recap_b_available_tomorrow },
    { label: "C. Last 8 days if restart taken", value: dailyLog.recap_c_last_8_days_if_restart },
  ];

  return (
    <div className="border-t border-ink-200 pt-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {boxes.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-ink-200 bg-ink-50 px-2.5 py-2">
            <p className="font-mono text-lg leading-tight font-semibold text-ink-900">{value.toFixed(1)}</p>
            <p className="text-[10px] leading-tight text-ink-500">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-ink-500 italic">
        If {RESTART_HOURS} consecutive hours off duty are taken, {MAX_CYCLE_HOURS} hours become available under the
        70-hr/8-day cycle.
      </p>
    </div>
  );
}
