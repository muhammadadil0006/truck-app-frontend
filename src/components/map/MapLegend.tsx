import { BedDouble, Flag, Fuel, Package, RotateCcw } from "lucide-react";

import { STOP_TYPE_STYLE, StopType } from "../../constants/stopTypes";

const STOP_TYPE_ICON = {
  [StopType.Pickup]: Package,
  [StopType.Dropoff]: Flag,
  [StopType.Fuel]: Fuel,
  [StopType.Rest10Hr]: BedDouble,
  [StopType.Restart34Hr]: RotateCcw,
};

const LEGEND_ORDER = Object.values(StopType);


export function MapLegend() {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-ink-700 bg-ink-800/40 p-4 shadow-panel sm:w-52">
      <p className="font-display text-xs font-semibold tracking-wider text-ink-300 uppercase">Map legend</p>
      <ul className="stagger mt-3 space-y-3">
        {LEGEND_ORDER.map((type) => {
          const { color, label } = STOP_TYPE_STYLE[type];
          const Icon = STOP_TYPE_ICON[type];
          return (
            <li key={type} className="flex items-center gap-2.5">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ background: color }}
              >
                <Icon className="size-3.5" aria-hidden />
              </span>
              <span className="text-sm text-ink-200">{label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
