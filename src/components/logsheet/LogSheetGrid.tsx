import { useMemo } from "react";

import { DUTY_STATUS_LABEL, DUTY_STATUS_ROW_ORDER } from "../../constants/dutyStatus";
import type { LogSegment } from "../../features/trips/types";
import {
  buildStatusLinePath,
  computeGridGeometry,
  getStatusChangePoints,
} from "../../utils/logSheetGeometry";

export interface LogSheetGridProps {
  segments: LogSegment[]; // segments belonging to exactly one day
  width?: number;
  height?: number;
}

const HOUR_LABELS = [
  "Midnight", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
  "Noon", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
];

export function LogSheetGrid({ segments, width = 920, height = 180 }: LogSheetGridProps) {
  const geometry = useMemo(() => computeGridGeometry(width, height), [width, height]);
  const linePath = useMemo(() => buildStatusLinePath(segments, geometry), [segments, geometry]);
  const changePoints = useMemo(() => getStatusChangePoints(segments, geometry), [segments, geometry]);

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

      {/* row separator lines */}
      {DUTY_STATUS_ROW_ORDER.map((status, i) => (
        <line
          key={`row-${status}`}
          x1={geometry.padLeft}
          x2={width}
          y1={geometry.padTop + geometry.rowHeight * i}
          y2={geometry.padTop + geometry.rowHeight * i}
          stroke="#999"
          strokeWidth={1}
        />
      ))}
      <line
        x1={geometry.padLeft}
        x2={width}
        y1={height}
        y2={height}
        stroke="#999"
        strokeWidth={1}
      />

      {/* hourly + quarter-hour tick marks */}
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
