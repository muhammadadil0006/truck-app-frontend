import { useMemo } from "react";

import { SHOW_DEBUG_PANEL } from "../../constants/debug";
import { DutyStatus } from "../../constants/dutyStatus";
import type { DailyLog, Trip } from "../../features/trips/types";
import { LogSheetGrid } from "./LogSheetGrid";
import { LogSheetIdentityBlock } from "./LogSheetIdentityBlock";
import { LogSheetMetadataGrid } from "./LogSheetMetadataGrid";
import { RecapBoxes } from "./RecapBoxes";
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
        <div className="space-y-4 rounded-xl border-t-4 border-teal-500 bg-white p-4 text-ink-900 shadow-paper ring-1 ring-teal-500/15 sm:p-5">
          <LogSheetIdentityBlock trip={trip} dailyLog={dailyLog} />

          <LogSheetMetadataGrid />

          <div className="-mx-1 overflow-x-auto px-1">
            <div className="min-w-[640px]">
              <LogSheetGrid allTransitions={allTransitions} logDate={dailyLog.log_date} totals={totals} />
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-teal-700 uppercase">
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
