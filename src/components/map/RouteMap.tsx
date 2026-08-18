import { useEffect, useMemo } from "react";
import type { Feature, LineString } from "geojson";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAP_TILE_ATTRIBUTION, MAP_TILE_URL } from "../../constants/map";
import type { Stop } from "../../features/trips/types";
import { computeBoundsFromLngLat } from "../../utils/geo";
import { buildStopIcon } from "./markerIcons";
import { StopPopupContent } from "./StopPopupContent";

export interface RouteMapProps {
  routeGeometry: [number, number][];
  stops: Stop[];
}

function FitBoundsOnData({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [32, 32] });
  }, [bounds, map]);
  return null;
}

export function RouteMap({ routeGeometry, stops }: RouteMapProps) {
  const bounds = useMemo(
    () => (routeGeometry.length > 0 ? computeBoundsFromLngLat(routeGeometry) : null),
    [routeGeometry]
  );

  const lineFeature: Feature<LineString> = useMemo(
    () => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: routeGeometry },
    }),
    [routeGeometry]
  );

  return (
    <MapContainer center={DEFAULT_MAP_CENTER} zoom={DEFAULT_MAP_ZOOM} scrollWheelZoom className="h-[480px] w-full">
      <FitBoundsOnData bounds={bounds} />
      <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} />
      {routeGeometry.length > 0 && (
        <GeoJSON
          data={lineFeature}
          pathOptions={{ color: "#16babd", weight: 4, opacity: 0.9 }}
        />
      )}
      {stops.map((stop, i) => (
        <Marker key={`${stop.type}-${i}`} position={[stop.lat, stop.lng]} icon={buildStopIcon(stop.type)}>
          <Popup>
            <StopPopupContent stop={stop} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
