import { useState } from "react";
import { BedDouble } from "lucide-react";
import clsx from "clsx";

import type { Trip } from "../../features/trips/types";
import { formatDate } from "../../utils/time";
import { LogSheetPage } from "./LogSheetPage";

export function LogSheetPager({ trip }: { trip: Trip }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dailyLogs = trip.daily_logs;

  if (dailyLogs.length === 0) return null;

  const active = dailyLogs[activeIndex];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-ink-700 bg-ink-800/40 p-1.5">
        {dailyLogs.map((log, i) => {
          const isRest = log.total_driving_hours === 0;
          const isActive = i === activeIndex;
          return (
            <button
              key={log.day_index}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200",
                isActive
                  ? "bg-teal-500/15 text-teal-300 shadow-[inset_0_0_0_1px_rgba(22,186,189,0.35)]"
                  : "text-ink-300 hover:bg-ink-700/60 hover:text-ink-50"
              )}
            >
              Day {log.day_index}
              <span className="font-mono font-normal text-ink-400">{formatDate(log.log_date)}</span>
              {isRest && <BedDouble className="size-3 text-teal-400" aria-hidden />}
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
