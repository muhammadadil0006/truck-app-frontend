// Must match services.constants.StopType on the backend byte-for-byte.
// Plain const object + union type (not `enum`) — see dutyStatus.ts for why.
export const StopType = {
  Pickup: "pickup",
  Dropoff: "dropoff",
  Fuel: "fuel",
  Rest10Hr: "rest_10hr",
  Restart34Hr: "restart_34hr",
} as const;

export type StopType = (typeof StopType)[keyof typeof StopType];

export const STOP_TYPE_STYLE: Record<StopType, { color: string; label: string }> = {
  [StopType.Pickup]: { color: "#34d399", label: "Pickup" },
  [StopType.Dropoff]: { color: "#fb7185", label: "Dropoff" },
  [StopType.Fuel]: { color: "#fbbf24", label: "Fuel Stop" },
  [StopType.Rest10Hr]: { color: "#38bdf8", label: "10-Hr Rest" },
  [StopType.Restart34Hr]: { color: "#a78bfa", label: "34-Hr Restart" },
};
