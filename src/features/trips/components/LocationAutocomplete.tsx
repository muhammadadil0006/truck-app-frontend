import { useEffect, useState } from "react";

import { POPULAR_CITIES } from "../../../constants/popularCities";
import { useDebouncedValue } from "../../../utils/useDebouncedValue";
import { useAutocompleteLocationQuery } from "../tripApi";
import type { GeocodeSuggestion, ResolvedLocation } from "../types";

export interface LocationAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  value: ResolvedLocation | null;
  onChange: (location: ResolvedLocation | null) => void;
  error?: string;
}

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 300;

/**
 * Text input backed by GET /api/geocode/ (proxied to OpenRouteService).
 * Selecting a suggestion locks in its exact (label, lat, lng) — the same
 * point routing will later be computed against, since both the suggestion
 * list and the eventual directions call use the same ORS geocoder. Editing
 * the text after a selection clears the resolved value, forcing the user to
 * pick a suggestion again rather than submit free-text that was never
 * actually geocoded.
 */
export function LocationAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
}: LocationAutocompleteProps) {
  const [inputText, setInputText] = useState(value?.text ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedText = useDebouncedValue(inputText, DEBOUNCE_MS);

  const hasResolvedSelection = value !== null && inputText === value.text;
  const isEmpty = inputText.trim().length === 0;
  const shouldSearch = !hasResolvedSelection && !isEmpty && debouncedText.trim().length >= MIN_QUERY_LENGTH;

  const { data: liveSuggestions, isFetching } = useAutocompleteLocationQuery(debouncedText, {
    skip: !shouldSearch,
  });

  // Keep the input text in sync if the resolved value changes externally
  // (e.g. a form reset).
  useEffect(() => {
    setInputText(value?.text ?? "");
  }, [value]);

  // Before typing anything, show a quick-pick list instead of a blank field.
  const showPopularCities = isFocused && isEmpty;
  const showLiveResults = isFocused && shouldSearch && (liveSuggestions?.length ?? 0) > 0;
  const visibleSuggestions: GeocodeSuggestion[] = showPopularCities
    ? POPULAR_CITIES
    : (liveSuggestions ?? []);
  const showDropdown = showPopularCities || showLiveResults;

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          if (value !== null) onChange(null); // stale resolved value, force re-pick
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)} // let onMouseDown fire first
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {isFetching && isFocused && !showPopularCities && (
        <p className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-400 shadow-sm">
          Searching…
        </p>
      )}

      {showDropdown && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {showPopularCities && (
            <li className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Popular cities
            </li>
          )}
          {visibleSuggestions.map((s) => (
            <li key={`${s.lat}-${s.lng}`}>
              <button
                type="button"
                onMouseDown={() => {
                  setInputText(s.label);
                  onChange({ text: s.label, lat: s.lat, lng: s.lng });
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
