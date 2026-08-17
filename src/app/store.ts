import { configureStore } from "@reduxjs/toolkit";

import { tripApi } from "../features/trips/tripApi";

// RTK Query only — no plain Redux slices. usePlanTripMutation/useGetTripQuery/
// useListTripsQuery already expose loading/error/data state; mirroring that
// into a slice would be a stale-cache anti-pattern. See PLANNING.md's
// "Frontend state" decision for the full reasoning.
export const store = configureStore({
  reducer: {
    [tripApi.reducerPath]: tripApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tripApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
