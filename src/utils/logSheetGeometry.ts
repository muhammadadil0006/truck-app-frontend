import { DUTY_STATUS_ROW_ORDER, type DutyStatus } from "../constants/dutyStatus";
import type { Transition } from "../features/trips/types";

export interface GridGeometry {
  width: number;
  height: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  hourWidth: number;
  rowHeight: number;
  rowY: Record<DutyStatus, number>;
  gridRight: number;
}

const DEFAULT_PAD_LEFT = 140;
const DEFAULT_PAD_RIGHT = 56; // reserved for the per-row "Total Hours" column, matching the real form
const DEFAULT_PAD_TOP = 20;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = 1440;
const MS_PER_MINUTE = 60_000;

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

  return { width, height, padLeft, padRight, padTop, hourWidth, rowHeight, rowY, gridRight: width - padRight };
}

function xAtMinutesSinceMidnight(minutes: number, geometry: GridGeometry): number {
  const clamped = Math.min(MINUTES_PER_DAY, Math.max(0, minutes));
  return geometry.padLeft + (clamped / MINUTES_PER_DAY) * (HOURS_PER_DAY * geometry.hourWidth);
}

/** Minutes since local midnight for an ISO 8601 timestamp. */
export function minutesSinceMidnight(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

export function timeToX(iso: string, geometry: GridGeometry): number {
  return xAtMinutesSinceMidnight(minutesSinceMidnight(iso), geometry);
}

export interface SegmentLine {
  x1: number;
  x2: number;
  y: number;
  status: DutyStatus;
}

export interface ConnectorLine {
  x: number;
  y1: number;
  y2: number;
}

export interface StatusChangePoint {
  x: number;
  y: number;
  status: DutyStatus;
  location: string;
}

export interface DayLines {
  segmentLines: SegmentLine[];
  connectorLines: ConnectorLine[];
  changePoints: StatusChangePoint[];
}

/**
 * Builds one day's grid lines directly from the trip's full chronological
 * transitions list (every day's transitions, flattened) — no per-day
 * pre-split segments needed. Each transition's row is "in force" from its
 * own instant until the NEXT transition's instant (or the trip's last
 * transition runs to this day's midnight); that span is clipped to
 * [dayStart, dayEnd) to get this day's horizontal line, which is how a
 * multi-day status (e.g. a 34-hour restart spanning 3 calendar days) still
 * draws its correct, un-duplicated, continuous run on each day it touches.
 *
 * A vertical connector + dot are only drawn when the transition's instant
 * itself falls on this day — a same-status continuation from a previous day
 * has nothing to connect (the row didn't change today), so no vertical line
 * appears. Connector direction comes for free from row order
 * (DUTY_STATUS_ROW_ORDER: Off Duty, Sleeper Berth, Driving, On Duty —
 * top to bottom), since rowY increases with row index.
 */
export function buildDayLines(allTransitions: Transition[], logDate: string, geometry: GridGeometry): DayLines {
  const ordered = [...allTransitions].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const dayStart = new Date(`${logDate}T00:00:00`);
  const dayEnd = new Date(dayStart.getTime() + MINUTES_PER_DAY * MS_PER_MINUTE);

  const segmentLines: SegmentLine[] = [];
  const connectorLines: ConnectorLine[] = [];
  const changePoints: StatusChangePoint[] = [];

  ordered.forEach((t, i) => {
    const segStart = new Date(t.time);
    const next = ordered[i + 1];
    const segEnd = next ? new Date(next.time) : dayEnd;

    if (segEnd > dayStart && segStart < dayEnd) {
      const x1 = segStart <= dayStart ? geometry.padLeft : timeToX(t.time, geometry);
      const x2 = next && segEnd < dayEnd ? timeToX(next.time, geometry) : geometry.gridRight;
      segmentLines.push({ x1, x2, y: geometry.rowY[t.to_status], status: t.to_status });
    }

    if (t.from_status !== null && segStart >= dayStart && segStart < dayEnd) {
      const x = timeToX(t.time, geometry);
      connectorLines.push({ x, y1: geometry.rowY[t.from_status], y2: geometry.rowY[t.to_status] });
      changePoints.push({ x, y: geometry.rowY[t.to_status], status: t.to_status, location: t.location_text });
    }
  });

  return { segmentLines, connectorLines, changePoints };
}
