import clsx from "clsx";

import type { DailyLog } from "../../features/trips/types";
import { formatDate } from "../../utils/time";
import { DutyMixBar } from "./DutyMixBar";

export interface LogSheetDayTabProps {
  log: DailyLog;
  isActive: boolean;
  onSelect: () => void;
}

/** Single day-selector card in the LogSheetPager's tab strip. */
export function LogSheetDayTab({ log, isActive, onSelect }: LogSheetDayTabProps) {
  const isRest = log.total_driving_hours === 0;

  return (
    <button
      onClick={onSelect}
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
}
