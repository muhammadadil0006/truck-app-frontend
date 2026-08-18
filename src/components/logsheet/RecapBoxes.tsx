import { Info } from "lucide-react";

import { MAX_CYCLE_HOURS, RESTART_HOURS } from "../../constants/hos";
import type { DailyLog } from "../../features/trips/types";

/** Recap boxes per CLAUDE.md's 70/8-day schedule spec — on-duty hours today,
 * plus the A/B/C rolling-window figures the backend already computes. Each
 * box gets a hover/focus tooltip spelling out what the number means, same
 * pattern as the cycle-hours slider's info icon on the trip form. */
export function RecapBoxes({ dailyLog }: { dailyLog: DailyLog }) {
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
