import L from "leaflet";

import { STOP_TYPE_STYLE, type StopType } from "../../constants/stopTypes";

/** divIcon HTML pins (no external PNG assets) — styled purely via inline CSS
 * so pickup/dropoff/fuel/10hr-rest/34hr-restart stay visually distinct. */
export function buildStopIcon(type: StopType): L.DivIcon {
  const { color, glyph } = STOP_TYPE_STYLE[type];
  return L.divIcon({
    className: "trip-stop-marker",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);">
      <span style="transform:rotate(45deg);font-size:13px;line-height:1;color:white;">${glyph}</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}
