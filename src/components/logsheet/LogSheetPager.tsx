import { useState } from "react";

import type { Trip } from "../../features/trips/types";
import { DutyMixLegend } from "./DutyMixLegend";
import { LogSheetDayTab } from "./LogSheetDayTab";
import { LogSheetPage } from "./LogSheetPage";

export function LogSheetPager({ trip }: { trip: Trip }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dailyLogs = trip.daily_logs;

  if (dailyLogs.length === 0) return null;

  const active = dailyLogs[activeIndex];

  return (
    <div className="space-y-4">
      <DutyMixLegend />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {dailyLogs.map((log, i) => (
          <LogSheetDayTab key={log.day_index} log={log} isActive={i === activeIndex} onSelect={() => setActiveIndex(i)} />
        ))}
      </div>

      <div key={active.day_index} className="animate-fade-up">
        <LogSheetPage trip={trip} dailyLog={active} />
      </div>
    </div>
  );
}
