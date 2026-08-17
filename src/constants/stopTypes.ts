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

export const STOP_TYPE_STYLE: Record<StopType, { color: string; glyph: string; label: string }> = {
  [StopType.Pickup]: { color: "#16a34a", glyph: "P", label: "Pickup" },
  [StopType.Dropoff]: { color: "#dc2626", glyph: "D", label: "Dropoff" },
  [StopType.Fuel]: { color: "#f59e0b", glyph: "⛽", label: "Fuel Stop" },
  [StopType.Rest10Hr]: { color: "#2563eb", glyph: "🛏", label: "10-Hr Rest" },
  [StopType.Restart34Hr]: { color: "#7c3aed", glyph: "⟳", label: "34-Hr Restart" },
};
