import { ArrowRight, MapPin } from "lucide-react";

import type { DailyLog, Trip } from "../../features/trips/types";
import { formatDate } from "../../utils/time";

export interface LogSheetIdentityBlockProps {
  trip: Trip;
  dailyLog: DailyLog;
}

/** Title/route top-left, miles-driven-today stat top-right. */
export function LogSheetIdentityBlock({ trip, dailyLog }: LogSheetIdentityBlockProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 pb-4">
      <div>
        <p className="font-display text-xl font-bold text-ink-900">Driver's Daily Log</p>
        <p className="font-mono text-xs font-semibold text-teal-700">{formatDate(dailyLog.log_date)}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-600">
          <MapPin className="size-3.5 shrink-0 text-teal-600" aria-hidden />
          {trip.pickup_location_text}
          <ArrowRight className="size-3 shrink-0 text-ink-400" aria-hidden />
          {trip.dropoff_location_text}
        </p>
      </div>
      <div className="rounded-xl bg-teal-100 px-4 py-2 text-right">
        <p className="text-[10px] font-semibold tracking-wider text-teal-700 uppercase">Miles today</p>
        <p className="font-mono text-2xl leading-tight font-bold text-teal-800">
          {dailyLog.total_miles_today}
          <span className="text-xs font-normal text-teal-600"> mi</span>
        </p>
      </div>
    </div>
  );
}
