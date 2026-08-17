import type { GeocodeSuggestion } from "../features/trips/types";

/**
 * Shown in LocationAutocomplete's dropdown on focus, before the user types
 * anything — gives a quick-pick starting point instead of a blank field.
 * Coordinates are approximate city-center points, not ORS-resolved (fine
 * for a preset shortcut; if precision ever matters, route through
 * /api/geocode/ like everything else).
 */
export const POPULAR_CITIES: GeocodeSuggestion[] = [
  { label: "Chicago, Illinois, United States", lat: 41.8781, lng: -87.6298 },
  { label: "New York, New York, United States", lat: 40.7128, lng: -74.006 },
  { label: "Los Angeles, California, United States", lat: 34.0522, lng: -118.2437 },
  { label: "Dallas, Texas, United States", lat: 32.7767, lng: -96.797 },
  { label: "Houston, Texas, United States", lat: 29.7604, lng: -95.3698 },
  { label: "Phoenix, Arizona, United States", lat: 33.4484, lng: -112.074 },
  { label: "Philadelphia, Pennsylvania, United States", lat: 39.9526, lng: -75.1652 },
  { label: "Atlanta, Georgia, United States", lat: 33.749, lng: -84.388 },
  { label: "Denver, Colorado, United States", lat: 39.7392, lng: -104.9903 },
  { label: "Seattle, Washington, United States", lat: 47.6062, lng: -122.3321 },
  { label: "Miami, Florida, United States", lat: 25.7617, lng: -80.1918 },
  { label: "Las Vegas, Nevada, United States", lat: 36.1699, lng: -115.1398 },
];
