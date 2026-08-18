import { DUTY_STATUS_COLOR, DUTY_STATUS_ROW_ORDER, DutyStatus, DUTY_STATUS_LABEL } from "../../constants/dutyStatus";
import type { DailyLog } from "../../features/trips/types";

const DAY_TOTAL_KEY: Record<DutyStatus, keyof DailyLog> = {
  [DutyStatus.OffDuty]: "total_off_duty_hours",
  [DutyStatus.SleeperBerth]: "total_sleeper_berth_hours",
  [DutyStatus.Driving]: "total_driving_hours",
  [DutyStatus.OnDutyNotDriving]: "total_on_duty_hours",
};

/** Proportional 24-hr duty-mix bar — a glanceable summary so every day card
 * carries real signal (not just a date), letting a driver scan the whole
 * trip's rest/drive rhythm before opening any single sheet. */
export function DutyMixBar({ log }: { log: DailyLog }) {
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
