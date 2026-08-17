// Must match services.constants.DutyStatus on the backend byte-for-byte —
// these strings come straight through segment.status in the API response.
// Plain const object + union type (not `enum`) — this project's tsconfig
// has erasableSyntaxOnly, which disallows real TS enums.
export const DutyStatus = {
  OffDuty: "OFF_DUTY",
  SleeperBerth: "SLEEPER_BERTH",
  Driving: "DRIVING",
  OnDutyNotDriving: "ON_DUTY_NOT_DRIVING",
} as const;

export type DutyStatus = (typeof DutyStatus)[keyof typeof DutyStatus];

// Top-to-bottom row order on the log sheet grid, matching the FMCSA form.
export const DUTY_STATUS_ROW_ORDER: DutyStatus[] = [
  DutyStatus.OffDuty,
  DutyStatus.SleeperBerth,
  DutyStatus.Driving,
  DutyStatus.OnDutyNotDriving,
];

export const DUTY_STATUS_LABEL: Record<DutyStatus, string> = {
  [DutyStatus.OffDuty]: "Off Duty",
  [DutyStatus.SleeperBerth]: "Sleeper Berth",
  [DutyStatus.Driving]: "Driving",
  [DutyStatus.OnDutyNotDriving]: "On Duty (Not Driving)",
};

export const DUTY_STATUS_COLOR: Record<DutyStatus, string> = {
  [DutyStatus.OffDuty]: "#16a34a",
  [DutyStatus.SleeperBerth]: "#7c3aed",
  [DutyStatus.Driving]: "#dc2626",
  [DutyStatus.OnDutyNotDriving]: "#2563eb",
};
