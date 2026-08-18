import type { CSSProperties } from "react";
import { Gauge, Info } from "lucide-react";

import { MAX_CYCLE_HOURS } from "../../../constants/hos";

export interface CycleHoursInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const STEP = 0.5;

/** Zone the current value falls in, purely for the slider/readout color —
 * mirrors the backend's own thresholds (a 34-hr restart gets scheduled once
 * the cycle would exceed MAX_CYCLE_HOURS) so the color cue means something,
 * not just decoration. */
function zoneFor(hours: number): { color: string; label: string } {
  if (hours >= MAX_CYCLE_HOURS) return { color: "#fb7185", label: "At limit — restart required" };
  if (hours >= MAX_CYCLE_HOURS * 0.85) return { color: "#fbbf24", label: "Approaching limit" };
  return { color: "#16babd", label: "Within cycle" };
}

export function CycleHoursInput({ id, value, onChange, error }: CycleHoursInputProps) {
  const numeric = value.trim() === "" ? 0 : Number(value);
  const clamped = Number.isFinite(numeric) ? Math.min(Math.max(numeric, 0), MAX_CYCLE_HOURS) : 0;
  const pct = (clamped / MAX_CYCLE_HOURS) * 100;
  const zone = zoneFor(clamped);

  return (
    <div className="sm:col-span-2">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="flex items-center gap-1.5 font-display text-xs font-semibold tracking-wider text-ink-300 uppercase">
            <Gauge className="size-3.5" aria-hidden />
            Current cycle used
          </label>
          <span className="group relative flex">
            <button
              type="button"
              className="text-ink-500 transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none"
              aria-describedby={`${id}-help`}
            >
              <Info className="size-3.5" aria-hidden />
              <span className="sr-only">What is this?</span>
            </button>
            <span
              id={`${id}-help`}
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-[11px] font-normal tracking-normal text-ink-200 normal-case opacity-0 shadow-panel transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              Hours already logged on-duty in the rolling {MAX_CYCLE_HOURS}-hr/8-day cycle. Past {MAX_CYCLE_HOURS}, a
              34-hr restart is scheduled automatically.
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-800" />
            </span>
          </span>
        </div>
        <span className="font-mono text-lg font-semibold" style={{ color: zone.color }}>
          {value.trim() === "" ? "—" : clamped}
          <span className="ml-0.5 text-xs text-ink-400">/ {MAX_CYCLE_HOURS} hrs</span>
        </span>
      </div>

      <input
        id={id}
        type="range"
        className="hos-slider"
        style={{ "--fill": `${pct}%`, "--slider-color": zone.color } as CSSProperties}
        min={0}
        max={MAX_CYCLE_HOURS}
        step={STEP}
        value={clamped}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${id}-zone`}
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-500">
        <span>0</span>
        <span>35</span>
        <span>{MAX_CYCLE_HOURS}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={MAX_CYCLE_HOURS}
          step={STEP}
          placeholder="e.g. 10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-24 rounded-lg border bg-ink-800/60 px-2.5 py-1.5 font-mono text-sm text-ink-50 transition-colors focus:bg-ink-800 focus:outline-none ${
            error
              ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-ink-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          }`}
        />
        <p id={`${id}-zone`} className="text-right text-xs text-ink-400">
          {zone.label}
        </p>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}
