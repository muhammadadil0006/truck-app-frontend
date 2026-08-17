import type { DailyLog } from "../../features/trips/types";
import { formatHours } from "../../utils/format";

export function RecapBoxes({ dailyLog }: { dailyLog: DailyLog }) {
  const items = [
    { label: "On duty today", value: dailyLog.total_on_duty_hours + dailyLog.total_driving_hours },
    { label: "A. Last 7 days on duty", value: dailyLog.recap_a_last_7_days },
    { label: "B. Available tomorrow", value: dailyLog.recap_b_available_tomorrow },
    { label: "C. Last 8 days if restart", value: dailyLog.recap_c_last_8_days_if_restart },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-gray-200 p-2 text-center">
          <p className="text-xs text-gray-500">{item.label}</p>
          <p className="font-semibold">{formatHours(item.value)}</p>
        </div>
      ))}
    </div>
  );
}
