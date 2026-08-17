import { LOG_SHEET_DEFAULTS } from "../../constants/logSheetDefaults";
import type { DailyLog, Trip } from "../../features/trips/types";
import { formatDate } from "../../utils/time";
import { LogSheetGrid } from "./LogSheetGrid";
import { RecapBoxes } from "./RecapBoxes";
import { RemarksList } from "./RemarksList";

export interface LogSheetPageProps {
  trip: Trip;
  dailyLog: DailyLog;
}

/** One full ELD log sheet: header fields + grid + remarks + recap boxes,
 * per CLAUDE.md's "Daily Log Sheet — Required Fields & Layout" section. */
export function LogSheetPage({ trip, dailyLog }: LogSheetPageProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <div>
          <p className="font-semibold">Driver's Daily Log — {formatDate(dailyLog.log_date)}</p>
          <p className="text-gray-500">
            {LOG_SHEET_DEFAULTS.carrierName} · {trip.pickup_location_text} → {trip.dropoff_location_text}
          </p>
        </div>
        <div className="text-right text-gray-500">
          <p>{LOG_SHEET_DEFAULTS.truckTrailerNumber}</p>
          <p>{dailyLog.total_miles_today} mi today</p>
        </div>
      </div>

      <LogSheetGrid segments={dailyLog.segments} />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Remarks</p>
        <RemarksList segments={dailyLog.segments} />
      </div>

      <RecapBoxes dailyLog={dailyLog} />
    </div>
  );
}
