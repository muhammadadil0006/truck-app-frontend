import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "../../constants/api";
import type { GeocodeSuggestion, PlanTripRequest, Trip, TripListItem } from "./types";

export const tripApi = createApi({
  reducerPath: "tripApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
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
