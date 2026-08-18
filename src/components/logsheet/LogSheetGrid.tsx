import { useMemo } from "react";

import { DUTY_STATUS_LABEL, DUTY_STATUS_ROW_ORDER, type DutyStatus } from "../../constants/dutyStatus";
import type { Transition } from "../../features/trips/types";
import { buildDayLines, computeGridGeometry } from "../../utils/logSheetGeometry";

export interface LogSheetGridProps {
  /** Every transition of the WHOLE trip (all days flattened) — this day's
   * lines are derived by clipping each transition's run (until the next
   * transition) to [this day's midnight, next midnight), so a status that
   * started on an earlier day still draws its correct continuation here. */
  allTransitions: Transition[];
  logDate: string; // "YYYY-MM-DD" — which day this grid renders
  /** Total hours logged in each duty status today — rendered in the "Total
   * Hours" column at the right of the grid, per CLAUDE.md's requirement
   * that each row's total be written at the right side of the grid. */
  totals: Record<DutyStatus, number>;
  width?: number;
  height?: number;
}

// Label mapping only — purely cosmetic, doesn't touch any position/geometry
// math below (still exactly 24 entries, one per hour 0-23). Real FMCSA
// paper logs print the top axis as "Midnight 1 2 ... 11 Noon 1 2 ... 11"
// (12-hour clock, repeating 1-11 for both halves of the day), not raw
// 24-hour numbers — the grid's final column (the boundary after hour 23,
// i.e. next midnight) gets its own "Midnight" label separately below.
const HOUR_LABELS = [
  "Midnight", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
  "Noon", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
];

// Structural/template ink — tinted teal so the grid reads as this app's own
// letterhead rather than plain black-on-white, matching how many real ELD
// forms print their pre-ruled template in a distinct color from the
// driver's actual (black) entries. The recorded duty-status data below
// (segmentLines/connectorLines/changePoints) stays solid black — that's the
// one thing on this page that must never be mistaken for decoration.
const GRID_TEXT_COLOR = "#0a7f7a";
const GRID_LINE_STRONG = "#7dd0c9";
const GRID_LINE_SOFT = "#c3ece8";

export function LogSheetGrid({ allTransitions, logDate, totals, width = 1040, height = 180 }: LogSheetGridProps) {
  const geometry = useMemo(() => computeGridGeometry(width, height), [width, height]);
  const { segmentLines, connectorLines, changePoints } = useMemo(
    () => buildDayLines(allTransitions, logDate, geometry),
    [allTransitions, logDate, geometry]
  );
  const gridRight = geometry.gridRight;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="24-hour duty status log" className="w-full">
      {/* row labels */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <text
          key={status}
          x={4}
          y={geometry.rowsTop + geometry.rowHeight * i + geometry.rowHeight / 2}
          fontSize={11}
          fill={GRID_TEXT_COLOR}
          dominantBaseline="middle"
        >
          {i + 1}. {DUTY_STATUS_LABEL[status]}
        </text>
      ))}

      {/* "Total Hours" column header */}
      <text x={gridRight + 16} y={geometry.padTop - 6} fontSize={9} fontWeight="bold" fill={GRID_TEXT_COLOR}>
        Total
      </text>

      {/* row separator lines — purely structural (like a paper log's
          pre-printed template), drawn for all 24hrs regardless of data.
          Dashed, not solid: a solid stroke on this grid must only ever mean
          real duty-status data, never be confused with a printed ruling. */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <line
          key={`row-${status}`}
          x1={geometry.padLeft}
          x2={gridRight}
          y1={geometry.rowsTop + geometry.rowHeight * i}
          y2={geometry.rowsTop + geometry.rowHeight * i}
          stroke={GRID_LINE_STRONG}
          strokeWidth={1}
          strokeDasharray="1 3"
        />
      ))}
      <line
        x1={geometry.padLeft}
        x2={gridRight}
        y1={height}
        y2={height}
        stroke={GRID_LINE_STRONG}
        strokeWidth={1}
        strokeDasharray="1 3"
      />

      {/* per-row total hours, right of the grid */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <text
          key={`total-${status}`}
          x={gridRight + 16}
          y={geometry.rowsTop + geometry.rowHeight * i + geometry.rowHeight / 2}
          fontSize={11}
          fontWeight="bold"
          fill="black"
          dominantBaseline="middle"
        >
          {(totals[status] ?? 0).toFixed(2)}
        </text>
      ))}

      {/* quarter-hour tick marks — 3 per hour cell (15/30/45) per row,
          matching the real FMCSA form's ruling: short-tall-short heights
          (the 30-min mark is the prominent half-hour tick), rows 1-2
          (Off Duty, Sleeper Berth) hang down from the row's top wall, rows
          3-4 (Driving, On Duty) rise up from the row's bottom wall. */}
      {DUTY_STATUS_ROW_ORDER.map((status, rowIndex) => {
        const anchorsFromTop = rowIndex < 2;
        const rowTop = geometry.rowsTop + geometry.rowHeight * rowIndex;
        const rowBottom = rowTop + geometry.rowHeight;

        return HOUR_LABELS.map((_, hour) =>
          [
            { quarter: 1, ratio: 0.25 },
            { quarter: 2, ratio: 0.55 },
            { quarter: 3, ratio: 0.25 },
          ].map(({ quarter, ratio }) => {
            const x = geometry.padLeft + hour * geometry.hourWidth + (quarter * geometry.hourWidth) / 4;
            const tickLength = geometry.rowHeight * ratio;
            const y1 = anchorsFromTop ? rowTop : rowBottom;
            const y2 = anchorsFromTop ? rowTop + tickLength : rowBottom - tickLength;
            return (
              <line
                key={`${status}-${hour}-q${quarter}`}
                x1={x}
                x2={x}
                y1={y1}
                y2={y2}
                stroke={GRID_LINE_SOFT}
                strokeWidth={0.75}
              />
            );
          })
        );
      })}

      {/* hourly tick marks + labels — "1" appears twice (AM and PM), so key
          by index, not label text */}
      {HOUR_LABELS.map((label, hour) => {
        const x = geometry.padLeft + hour * geometry.hourWidth;
        return (
          <g key={hour}>
            <line x1={x} x2={x} y1={geometry.padTop} y2={height} stroke={GRID_LINE_STRONG} strokeWidth={1} />
            <text x={x} y={geometry.padTop - 6} fontSize={9} fill={GRID_TEXT_COLOR} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}

      {/* grid's final boundary (next midnight) — closes the 24-hr axis on
          the right. "Midnight" is a much wider label than a bare "11", so
          it's raised onto its own line (smaller, offset up) instead of
          sharing the hour-axis row — sharing that row squeezed it against
          both the "11" tick to its left and the "Total" header to its
          right. A short connector stub links the raised label straight
          down to its own tick, so it can't read as floating over the
          wrong column even though it's centered exactly on this x. */}
      <g>
        <line x1={gridRight} x2={gridRight} y1={geometry.padTop - 10} y2={height} stroke={GRID_LINE_STRONG} strokeWidth={1} />
        <text x={gridRight} y={geometry.padTop - 16} fontSize={7.5} fill={GRID_TEXT_COLOR} textAnchor="middle">
          Midnight
        </text>
      </g>

      {/* duty-status data: one horizontal line per segment (its own row,
          its own exact time span), one vertical line per real transition */}
      {segmentLines.map((l, i) => (
        <line key={`seg-${i}-${l.status}`} x1={l.x1} x2={l.x2} y1={l.y} y2={l.y} stroke="black" strokeWidth={2} />
      ))}
      {connectorLines.map((c, i) => (
        <line key={`conn-${i}-${c.x}`} x1={c.x} x2={c.x} y1={c.y1} y2={c.y2} stroke="black" strokeWidth={2} />
      ))}
      {changePoints.map((p, i) => (
        <circle key={`${p.x}-${p.status}-${i}`} cx={p.x} cy={p.y} r={2.5} fill="black" />
      ))}
    </svg>
  );
}
