import { useMemo } from "react";

import { SHOW_DEBUG_PANEL } from "../../constants/debug";
import { DutyStatus } from "../../constants/dutyStatus";
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
 * "Daily Log Sheet — Required Fields & Layout" section. */
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
      <div className="min-w-0 flex-1 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        {/* Header fields */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <div>
            <p className="font-semibold">Driver's Daily Log — {formatDate(dailyLog.log_date)}</p>
            <p className="text-gray-500">{trip.pickup_location_text} → {trip.dropoff_location_text}</p>
            <p className="text-gray-500">Carrier: {LOG_SHEET_DEFAULTS.carrierName}</p>
            <p className="text-gray-500">Main office: {LOG_SHEET_DEFAULTS.mainOfficeAddress}</p>
            <p className="text-gray-500">Shipping doc no.: {LOG_SHEET_DEFAULTS.shippingDocNumber}</p>
          </div>
          <div className="text-gray-500 sm:text-right">
            <p>Vehicle: {LOG_SHEET_DEFAULTS.truckTrailerNumber}</p>
            <p>Total miles driving today: {dailyLog.total_miles_today} mi</p>
            <p>Total mileage today: Not tracked</p>
            <p>Driver: {LOG_SHEET_DEFAULTS.driverName} (certified true and correct)</p>
            <p>Co-driver: {LOG_SHEET_DEFAULTS.coDriverName || "None"}</p>
            <p>Time zone: {LOG_SHEET_DEFAULTS.homeTerminalTimeZone}</p>
          </div>
        </div>

        <LogSheetGrid allTransitions={allTransitions} logDate={dailyLog.log_date} totals={totals} />

        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
            Remarks (pickup, dropoff, breaks, rest, fuel, and location at every duty-status change)
          </p>
          <RemarksList transitions={dailyLog.transitions} />
        </div>
      </div>

      {SHOW_DEBUG_PANEL && <TransitionsDebugPanel transitions={dailyLog.transitions} />}
    </div>
  );
}
