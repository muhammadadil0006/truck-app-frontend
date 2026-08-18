import { DUTY_STATUS_ROW_ORDER, type DutyStatus } from "../constants/dutyStatus";
import type { LogSegment, Transition } from "../features/trips/types";

export interface GridGeometry {
  width: number;
  height: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  hourWidth: number;
  rowHeight: number;
  rowY: Record<DutyStatus, number>;
}

const DEFAULT_PAD_LEFT = 140;
const DEFAULT_PAD_RIGHT = 56; // reserved for the per-row "Total Hours" column, matching the real form
const DEFAULT_PAD_TOP = 20;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = 1440;

export function computeGridGeometry(width: number, height: number): GridGeometry {
  const padLeft = DEFAULT_PAD_LEFT;
  const padRight = DEFAULT_PAD_RIGHT;
  const padTop = DEFAULT_PAD_TOP;
  const hourWidth = (width - padLeft - padRight) / HOURS_PER_DAY;
  const rowHeight = (height - padTop) / DUTY_STATUS_ROW_ORDER.length;

  const rowY = {} as Record<DutyStatus, number>;
  DUTY_STATUS_ROW_ORDER.forEach((status, i) => {
    rowY[status] = padTop + rowHeight * i + rowHeight / 2;
  });

  return { width, height, padLeft, padRight, padTop, hourWidth, rowHeight, rowY };
}

/** Minutes since local midnight for an ISO 8601 timestamp. Segments are
 * expected to already be split so they never cross midnight (see backend's
 * services/hos_engine/log_splitter.py). */
export function minutesSinceMidnight(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

export function timeToX(iso: string, geometry: GridGeometry): number {
  const clamped = Math.min(MINUTES_PER_DAY, Math.max(0, minutesSinceMidnight(iso)));
  return geometry.padLeft + (clamped / MINUTES_PER_DAY) * (HOURS_PER_DAY * geometry.hourWidth);
}

/**
 * Builds one continuous stepped SVG path across all 4 duty-status lanes for
 * a single day's segments, matching the real FMCSA log's continuous line
 * (not 4 independent bars). Assumes segments are chronologically contiguous
 * within the day (end_time[i] === start_time[i+1]) — true by construction
 * from the backend's log splitter.
 */
export function buildStatusLinePath(segments: LogSegment[], geometry: GridGeometry): string {
  if (segments.length === 0) return "";

  const first = segments[0];
  let d = `M ${timeToX(first.start_time, geometry)} ${geometry.rowY[first.status]}`;

  segments.forEach((seg, i) => {
    const xEnd = timeToX(seg.end_time, geometry);
    const yThis = geometry.rowY[seg.status];
    d += ` L ${xEnd} ${yThis}`;

    const next = segments[i + 1];
    if (next) {
      d += ` L ${xEnd} ${geometry.rowY[next.status]}`;
    }
  });

  return d;
}

export interface StatusChangePoint {
  x: number;
  y: number;
  status: DutyStatus;
  location: string;
}

/** One dot per REAL duty-status change that day, from the backend's
 * explicit transitions list — not derived from adjacent segments, so a day
 * that opens mid-reset (same status continuing from before midnight)
 * correctly shows no dot at Midnight. */
export function getTransitionPoints(transitions: Transition[], geometry: GridGeometry): StatusChangePoint[] {
  return transitions.map((t) => ({
    x: timeToX(t.time, geometry),
    y: geometry.rowY[t.to_status],
    status: t.to_status,
    location: t.location_text,
  }));
}
