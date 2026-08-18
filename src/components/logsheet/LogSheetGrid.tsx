import { useMemo } from "react";

import { DUTY_STATUS_LABEL, DUTY_STATUS_ROW_ORDER, type DutyStatus } from "../../constants/dutyStatus";
import type { LogSegment } from "../../features/trips/types";
import {
  buildStatusLinePath,
  computeGridGeometry,
  getStatusChangePoints,
} from "../../utils/logSheetGeometry";

export interface LogSheetGridProps {
  segments: LogSegment[]; // segments belonging to exactly one day
  /** Total hours logged in each duty status today — rendered in the "Total
   * Hours" column at the right of the grid, per CLAUDE.md's requirement
   * that each row's total be written at the right side of the grid. */
  totals: Record<DutyStatus, number>;
  width?: number;
  height?: number;
}

const HOUR_LABELS = [
  "Midnight", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
  "Noon", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
];

export function LogSheetGrid({ segments, totals, width = 920, height = 180 }: LogSheetGridProps) {
  const geometry = useMemo(() => computeGridGeometry(width, height), [width, height]);
  const linePath = useMemo(() => buildStatusLinePath(segments, geometry), [segments, geometry]);
  const changePoints = useMemo(() => getStatusChangePoints(segments, geometry), [segments, geometry]);
  const gridRight = width - geometry.padRight;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="24-hour duty status log" className="w-full">
      {/* row labels */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <text
          key={status}
          x={4}
          y={geometry.padTop + geometry.rowHeight * i + geometry.rowHeight / 2}
          fontSize={11}
          dominantBaseline="middle"
        >
          {i + 1}. {DUTY_STATUS_LABEL[status]}
        </text>
      ))}

      {/* "Total Hours" column header */}
      <text x={gridRight + 6} y={geometry.padTop - 6} fontSize={9} fontWeight="bold">
        Total
      </text>

      {/* row separator lines */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <line
          key={`row-${status}`}
          x1={geometry.padLeft}
          x2={gridRight}
          y1={geometry.padTop + geometry.rowHeight * i}
          y2={geometry.padTop + geometry.rowHeight * i}
          stroke="#999"
          strokeWidth={1}
        />
      ))}
      <line x1={geometry.padLeft} x2={gridRight} y1={height} y2={height} stroke="#999" strokeWidth={1} />

      {/* per-row total hours, right of the grid */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <text
          key={`total-${status}`}
          x={gridRight + 6}
          y={geometry.padTop + geometry.rowHeight * i + geometry.rowHeight / 2}
          fontSize={11}
          fontWeight="bold"
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
        const rowTop = geometry.padTop + geometry.rowHeight * rowIndex;
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
                stroke="#ccc"
                strokeWidth={0.75}
              />
            );
          })
        );
      })}

      {/* hourly tick marks + labels */}
      {HOUR_LABELS.map((label, hour) => {
        const x = geometry.padLeft + hour * geometry.hourWidth;
        return (
          <g key={label}>
            <line x1={x} x2={x} y1={geometry.padTop} y2={height} stroke="#ccc" strokeWidth={1} />
            <text x={x} y={geometry.padTop - 6} fontSize={9} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}

      {/* the continuous stepped duty-status path */}
      <path d={linePath} fill="none" stroke="black" strokeWidth={2} />
      {changePoints.map((p) => (
        <circle key={`${p.x}-${p.status}`} cx={p.x} cy={p.y} r={2.5} fill="black" />
      ))}
    </svg>
  );
}
