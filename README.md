# ELD Trip Planner — Frontend

React + TypeScript + Vite, Redux Toolkit + RTK Query, Tailwind CSS, Leaflet
for the map, hand-rolled SVG for the ELD log sheet grid. See
[`../PLANNING.md`](../PLANNING.md) for the full architecture and API
contract, and [`../CLAUDE.md`](../CLAUDE.md) for what the log sheet must
visually match.

## Local Setup

```bash
cd frontend
npm install
cp .env.sample .env
# Edit .env if your backend isn't running on the default localhost:8000

npm run dev
```

App is now live at `http://localhost:5173/` (or whatever port Vite picks).
Make sure the backend (`../backend/`) is running first — see
[`../backend/README.md`](../backend/README.md).

## Environment Variables

| Variable | Local default | Production (Vercel) |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/` | your deployed Render backend URL + `/api/` |

Only `VITE_`-prefixed variables are exposed to client code by Vite — this is
the one env var the app needs. See `.env.sample`.

**Note**: Vite bakes env vars in at build time, not read dynamically at
runtime — changing `VITE_API_BASE_URL` on Vercel requires a redeploy to take
effect.

## Project Structure

```
frontend/src/
├── app/                 # Redux store + typed hooks
├── constants/           # duty-status/stop-type enums+colors, map tile config, API base URL
├── features/trips/      # tripApi (RTK Query incl. autocompleteLocation), types, form/results components, pages
│   └── components/LocationAutocomplete.tsx  # location fields — see below
├── components/
│   ├── map/              # RouteMap (react-leaflet) + marker icons/popups
│   ├── logsheet/         # LogSheetGrid (hand-rolled SVG), pager, remarks
│   └── ui/               # Button, Spinner, ErrorBanner
└── utils/                # pure functions: log-sheet geometry, geo/time/format helpers, form validation
```

**State management**: RTK Query only — no plain Redux slices.
`usePlanTripMutation`/`useGetTripQuery`/`useListTripsQuery` already expose
`isLoading`/`isError`/`data`. The trip form's 4 fields live in local
`useState` (`TripForm.tsx`). See `../PLANNING.md` § Architecture Decisions
for the full reasoning.

**Location fields**: `LocationAutocomplete.tsx` calls the backend's
`GET /api/geocode/` proxy (debounced, min 3 characters) and requires the
user to select a suggestion — the exact `(label, lat, lng)` picked is what
gets submitted. Editing the text after selecting clears the resolved value,
forcing a re-pick rather than allowing stale/mismatched coordinates through.
This guarantees the location shown in the UI is exactly the location the
trip is planned from.

**Log sheet grid**: `src/utils/logSheetGeometry.ts` holds pure geometry
functions (`computeGridGeometry`, `timeToX`, `buildStatusLinePath`) kept
separate from the `LogSheetGrid.tsx` rendering component — draws one
continuous stepped SVG path per day across the 4 duty-status lanes, matching
the real FMCSA form (`../blank-paper-log.png`), not 4 independent bars.

## Type Checking & Build

```bash
npm run build      # runs `tsc -b` then `vite build` — fails on type errors
npm run lint        # oxlint
```

Note: this project's `tsconfig.app.json` has `erasableSyntaxOnly` enabled,
which disallows real TypeScript `enum`s — `DutyStatus`/`StopType` are
plain `as const` objects + derived union types instead (see
`src/constants/dutyStatus.ts`).

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project**, import the repo, set **Root Directory** to
   `frontend`.
3. Framework preset: **Vite** (auto-detected from `vite.config.ts`).
4. Build command: `npm run build` (default). Output directory: `dist`
   (default).
5. Add environment variable `VITE_API_BASE_URL` = your deployed backend URL
   + `/api/` (e.g. `https://eld-trip-planner-api.onrender.com/api/`), set
   for Production (and Preview if you want preview deploys to also hit the
   real backend).
6. Deploy. `vercel.json` in this directory already handles SPA routing so
   deep links like `/trips/<id>` don't 404 on refresh.

## Connecting the Two Apps

1. Deploy the backend first (see `../backend/README.md`), note its URL.
2. Set `VITE_API_BASE_URL` here to that URL + `/api/`, deploy this frontend.
3. Go back to the backend's `CORS_ALLOWED_ORIGINS` env var and add this
   frontend's deployed Vercel URL, redeploy the backend.
4. Both HTTPS — a Vercel HTTPS frontend will silently block requests to a
   plain-HTTP backend as mixed content, so confirm Render is serving HTTPS
   (it does by default).
