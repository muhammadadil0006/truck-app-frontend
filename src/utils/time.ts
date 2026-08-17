import { format, parseISO } from "date-fns";

export function formatTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, h:mm a");
}
