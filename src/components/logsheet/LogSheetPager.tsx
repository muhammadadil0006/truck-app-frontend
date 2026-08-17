import { useState } from "react";
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
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {dailyLogs.map((log, i) => (
          <button
            key={log.day_index}
            onClick={() => setActiveIndex(i)}
            className={clsx(
              "px-3 py-2 text-sm",
              i === activeIndex
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            Day {log.day_index} — {formatDate(log.log_date)}
            {log.total_driving_hours === 0 && (
              <span className="ml-1 rounded bg-gray-100 px-1 text-[10px] text-gray-500">rest</span>
            )}
          </button>
        ))}
      </div>

      <LogSheetPage trip={trip} dailyLog={active} />
    </div>
  );
}
