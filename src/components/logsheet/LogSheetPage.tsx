import { useMemo } from "react";
import { ArrowRight, Info, MapPin } from "lucide-react";

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
        <div className="space-y-4 rounded-xl border-t-4 border-teal-500 bg-white p-4 text-ink-900 shadow-paper ring-1 ring-teal-500/15 sm:p-5">
          {/* Identity block — title/route top-left, miles-today stat top-right */}
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

          {/* Header metadata — label-over-value pairs, not run-on sentences */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-ink-200 pb-4 sm:grid-cols-4">
            <PaperField label="Carrier" value={LOG_SHEET_DEFAULTS.carrierName} />
            <PaperField label="Main office" value={LOG_SHEET_DEFAULTS.mainOfficeAddress} />
            <PaperField label="Shipping doc" value={LOG_SHEET_DEFAULTS.shippingDocNumber} />
            <PaperField label="Time zone" value={LOG_SHEET_DEFAULTS.homeTerminalTimeZone} />
            <PaperField label="Vehicle" value={LOG_SHEET_DEFAULTS.truckTrailerNumber} />
            <PaperField label="Driver" value={LOG_SHEET_DEFAULTS.driverName} />
            <PaperField label="Co-driver" value={LOG_SHEET_DEFAULTS.coDriverName || "None"} />
          </div>
          <p className="-mt-2 text-[10px] text-ink-400 italic">
            Driver certifies these entries are true and correct.
          </p>

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

/** Small label-over-value pair for the paper log's metadata grid — teal
 * caption + dark value, replacing what used to be run-on "Label: value"
 * sentences. */
function PaperField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold tracking-wider text-teal-700 uppercase">{label}</p>
      <p className="truncate text-xs font-medium text-ink-800">{value}</p>
    </div>
  );
}

/** Recap boxes per CLAUDE.md's 70/8-day schedule spec — on-duty hours today,
 * plus the A/B/C rolling-window figures the backend already computes. Each
 * box gets a hover/focus tooltip spelling out what the number means, same
 * pattern as the cycle-hours slider's info icon on the trip form. */
function RecapBoxes({ dailyLog }: { dailyLog: DailyLog }) {
  const onDutyToday = dailyLog.total_driving_hours + dailyLog.total_on_duty_hours;
  const boxes = [
    {
      key: "today",
      label: "On duty today",
      value: onDutyToday,
      detail: "Driving + on-duty (not driving) hours today — lines 3 and 4 of the grid above, added together.",
    },
    {
      key: "a",
      label: "A. Last 7 days incl. today",
      value: dailyLog.recap_a_last_7_days,
      detail: "Rolling total of on-duty hours (driving + not driving) over the last 7 calendar days, including today.",
    },
    {
      key: "b",
      label: "B. Available tomorrow",
      value: dailyLog.recap_b_available_tomorrow,
      detail: `${MAX_CYCLE_HOURS} hours minus A — how many on-duty hours are left before hitting the ${MAX_CYCLE_HOURS}-hr/8-day limit.`,
    },
    {
      key: "c",
      label: "C. Last 8 days if restart taken",
      value: dailyLog.recap_c_last_8_days_if_restart,
      detail: `What A would total across the last 8 days if a ${RESTART_HOURS}-hr restart were taken before today — shows the cycle time a restart would free up.`,
    },
  ];

  return (
    <div className="border-t border-ink-200 pt-3">
      <div className="mb-2">
        <p className="font-display text-xs font-bold tracking-wider text-teal-700 uppercase">Recap</p>
        <p className="text-[10px] text-ink-400 italic">Complete at end of day</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {boxes.map(({ key, label, value, detail }) => (
          <div
            key={key}
            className="group relative z-0 rounded-lg border border-teal-100 bg-teal-100/40 px-2.5 py-2 hover:z-20 focus-within:z-20"
          >
            <p className="font-mono text-lg leading-tight font-semibold text-teal-800">{value.toFixed(1)}</p>
            <p className="flex items-center gap-1 text-[10px] leading-tight text-ink-500">
              {label}
              <button
                type="button"
                className="text-ink-400 transition-colors hover:text-teal-600 focus-visible:text-teal-600 focus-visible:outline-none"
                aria-describedby={`recap-${key}-help`}
              >
                <Info className="size-3" aria-hidden />
                <span className="sr-only">What is this?</span>
              </button>
            </p>
            <span
              id={`recap-${key}-help`}
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-lg border border-ink-600 bg-ink-800 px-2.5 py-2 text-[10px] font-normal normal-case text-ink-200 opacity-0 shadow-panel transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {detail}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-800" />
            </span>
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
