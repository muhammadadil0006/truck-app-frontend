import L from "leaflet";

import { STOP_TYPE_STYLE, type StopType } from "../../constants/stopTypes";

const ICON_SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"';

// Small line-art glyphs (no emoji — inconsistent color/weight across
// platforms clashed with the rest of the theme). Package/Flag/Fuel/Bed/
// RotateCcw shapes, hand-traced to lucide's icon set for visual consistency
// with the rest of the app's iconography.
const GLYPH_SVG: Record<StopType, string> = {
  pickup: `<svg ${ICON_SVG_ATTRS}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  dropoff: `<svg ${ICON_SVG_ATTRS}><path d="M4 22V4a1 1 0 0 1 1-1h13.5a.5.5 0 0 1 .4.8L16 8l2.9 4.2a.5.5 0 0 1-.4.8H5a1 1 0 0 0-1 1"/></svg>`,
  fuel: `<svg ${ICON_SVG_ATTRS}><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2V9.83a2 2 0 0 0-.59-1.42L18 7"/></svg>`,
  rest_10hr: `<svg ${ICON_SVG_ATTRS}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/></svg>`,
  restart_34hr: `<svg ${ICON_SVG_ATTRS}><path d="M3 12a9 9 0 1 0 2.64-6.36"/><path d="M3 3v6h6"/></svg>`,
};

/** divIcon HTML pins (no external PNG assets) — styled purely via inline CSS
 * so pickup/dropoff/fuel/10hr-rest/34hr-restart stay visually distinct. */
export function buildStopIcon(type: StopType): L.DivIcon {
  const { color } = STOP_TYPE_STYLE[type];
  return L.divIcon({
    className: "trip-stop-marker",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #0a0f14;box-shadow:0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px ${color}55;">
      <span style="transform:rotate(45deg);display:flex;">${GLYPH_SVG[type]}</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}
