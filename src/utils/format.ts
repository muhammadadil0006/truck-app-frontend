const milesFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const hoursFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function formatMiles(miles: number | null): string {
  if (miles === null) return "—";
  return `${milesFormatter.format(miles)} mi`;
}

export function formatHours(hours: number | null): string {
  if (hours === null) return "—";
  return `${hoursFormatter.format(hours)} hr`;
}
