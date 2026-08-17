import type { LatLngBoundsExpression } from "leaflet";

/** Backend sends GeoJSON [lng, lat] pairs; Leaflet wants [lat, lng]. */
export function lngLatToLatLng(pairs: [number, number][]): [number, number][] {
  return pairs.map(([lng, lat]) => [lat, lng]);
}

export function computeBoundsFromLngLat(pairs: [number, number][]): LatLngBoundsExpression {
  const latLngs = lngLatToLatLng(pairs);
  return latLngs as LatLngBoundsExpression;
}
