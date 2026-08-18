import { DUTY_STATUS_COLOR, DUTY_STATUS_ROW_ORDER, DUTY_STATUS_LABEL } from "../../constants/dutyStatus";

/** What the DutyMixBar's segment colors mean — shown once above the day
 * cards rather than repeated on every bar. */
export function DutyMixLegend() {
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
