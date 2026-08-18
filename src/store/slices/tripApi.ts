import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "../../constants/api";
import { getGuestId } from "../../utils/guestId";
import type { GeocodeSuggestion, PlanTripRequest, Trip, TripListItem } from "../../features/trips/types";

export const tripApi = createApi({
  reducerPath: "tripApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // Scopes trip history/deletion to this browser — no server sessions,
    // just a localStorage id attached to every request. Retrieve-by-id
    // ignores it server-side (shareable link), so it's harmless to send
    // there too.
    prepareHeaders: (headers) => {
      headers.set("X-Guest-Id", getGuestId());
      return headers;
    },
  }),
  tagTypes: ["Trip"],
  endpoints: (builder) => ({
    planTrip: builder.mutation<Trip, PlanTripRequest>({
      query: (body) => ({ url: "trips/", method: "POST", body }),
      invalidatesTags: ["Trip"],
    }),
    getTrip: builder.query<Trip, string>({
      query: (id) => `trips/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Trip", id }],
    }),
    listTrips: builder.query<TripListItem[], void>({
      query: () => "trips/",
      providesTags: (result) =>
        result
          ? [...result.map((t) => ({ type: "Trip" as const, id: t.id })), "Trip" as const]
          : ["Trip"],
    }),
    deleteTrip: builder.mutation<void, string>({
      query: (id) => ({ url: `trips/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Trip"],
    }),
    // Proxied through the backend (never calls ORS directly) so the API key
    // stays server-side and suggestions come from the same geocoder the
    // trip's route will actually be computed against.
    autocompleteLocation: builder.query<GeocodeSuggestion[], string>({
      query: (text) => `geocode/?q=${encodeURIComponent(text)}`,
    }),
  }),
});

export const {
  usePlanTripMutation,
  useGetTripQuery,
  useListTripsQuery,
  useDeleteTripMutation,
  useAutocompleteLocationQuery,
} = tripApi;
