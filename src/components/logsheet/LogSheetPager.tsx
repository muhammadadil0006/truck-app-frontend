import { useState } from "react";
import clsx from "clsx";

import { DUTY_STATUS_COLOR, DUTY_STATUS_ROW_ORDER, DutyStatus, DUTY_STATUS_LABEL } from "../../constants/dutyStatus";
import type { DailyLog, Trip } from "../../features/trips/types";
import { formatDate } from "../../utils/time";
import { LogSheetPage } from "./LogSheetPage";

const DAY_TOTAL_KEY: Record<DutyStatus, keyof DailyLog> = {
  [DutyStatus.OffDuty]: "total_off_duty_hours",
  [DutyStatus.SleeperBerth]: "total_sleeper_berth_hours",
  [DutyStatus.Driving]: "total_driving_hours",
  [DutyStatus.OnDutyNotDriving]: "total_on_duty_hours",
};

/** What the DutyMixBar's segment colors mean — shown once above the day
 * cards rather than repeated on every bar. */
function DutyMixLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {DUTY_STATUS_ROW_ORDER.map((status) => (
        <span key={status} className="flex items-center gap-1.5 text-xs text-ink-400">
          <span className="size-2 shrink-0 rounded-full" style={{ background: DUTY_STATUS_COLOR[status] }} aria-hidden />
          {DUTY_STATUS_LABEL[status]}
        </span>
      ))}
    </div>
  );
}

/** Proportional 24-hr duty-mix bar — a glanceable summary so every day card
 * carries real signal (not just a date), letting a driver scan the whole
 * trip's rest/drive rhythm before opening any single sheet. */
function DutyMixBar({ log }: { log: DailyLog }) {
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-ink-900">
      {DUTY_STATUS_ROW_ORDER.map((status) => {
        const hours = Number(log[DAY_TOTAL_KEY[status]] ?? 0);
        const pct = (hours / 24) * 100;
        if (pct <= 0) return null;
        return (
          <span
            key={status}
            style={{ width: `${pct}%`, background: DUTY_STATUS_COLOR[status] }}
            title={`${DUTY_STATUS_LABEL[status]}: ${hours.toFixed(1)}h`}
          />
        );
      })}
    </div>
  );
}

export function LogSheetPager({ trip }: { trip: Trip }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dailyLogs = trip.daily_logs;

  if (dailyLogs.length === 0) return null;

  const active = dailyLogs[activeIndex];

  return (
    <div className="space-y-4">
      <DutyMixLegend />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {dailyLogs.map((log, i) => {
          const isActive = i === activeIndex;
          const isRest = log.total_driving_hours === 0;
          return (
            <button
              key={log.day_index}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                "flex flex-col gap-2 rounded-xl border p-3 text-left transition-all duration-200",
                isActive
                  ? "border-teal-400/60 bg-teal-500/10 shadow-glow"
                  : "border-ink-700 bg-ink-800/40 hover:-translate-y-0.5 hover:border-ink-500 hover:bg-ink-800/70"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={clsx("font-display text-sm font-bold", isActive ? "text-teal-300" : "text-ink-100")}>
                  Day {log.day_index}
                </span>
                {isRest && (
                  <span className="rounded bg-ink-700 px-1.5 py-0.5 font-display text-[9px] font-semibold tracking-wider text-ink-300 uppercase">
                    Rest
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-ink-400">{formatDate(log.log_date)}</span>
              <DutyMixBar log={log} />
              <span className="font-mono text-xs text-ink-300">{log.total_driving_hours.toFixed(1)}h driving</span>
            </button>
          );
        })}
      </div>

      <div key={active.day_index} className="animate-fade-up">
        <LogSheetPage trip={trip} dailyLog={active} />
      </div>
    </div>
  );
}
