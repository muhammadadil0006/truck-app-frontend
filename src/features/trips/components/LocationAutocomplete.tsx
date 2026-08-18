import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Loader2, MapPin } from "lucide-react";
import clsx from "clsx";

import { POPULAR_CITIES } from "../../../constants/popularCities";
import { useDebouncedValue } from "../../../utils/useDebouncedValue";
import { useAutocompleteLocationQuery } from "../../../store/slices/tripApi";
import type { GeocodeSuggestion, ResolvedLocation } from "../types";

export interface LocationAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  value: ResolvedLocation | null;
  onChange: (location: ResolvedLocation | null) => void;
  error?: string;
  icon?: ReactNode;
  className?: string;
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
  icon,
  className,
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
    <div className={clsx("relative", showDropdown && "z-30", className)}>
      <label htmlFor={id} className="mb-1.5 block font-display text-xs font-semibold tracking-wider text-ink-300 uppercase">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400 peer-focus:text-teal-400">
            {icon}
          </span>
        )}
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
          className={clsx(
            "peer w-full rounded-xl border bg-ink-800/60 py-2.5 text-sm text-ink-50 placeholder:text-ink-400/70 transition-all duration-200 focus:bg-ink-800 focus:outline-none",
            icon ? "pr-3 pl-10" : "px-3",
            error
              ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-ink-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          )}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}

      {isFetching && isFocused && !showPopularCities && (
        <p className="animate-fade-in absolute z-30 mt-1.5 flex w-full items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-3 py-2 text-xs text-ink-400 shadow-panel">
          <Loader2 className="size-3.5 animate-spin text-teal-400" aria-hidden />
          Searching…
        </p>
      )}

      {showDropdown && (
        <ul className="animate-scale-in absolute z-30 mt-1.5 max-h-56 w-full origin-top overflow-auto rounded-xl border border-ink-600 bg-ink-800 py-1 shadow-panel">
          {showPopularCities && (
            <li className="px-3 py-1.5 font-display text-[10px] font-semibold tracking-wider text-ink-400 uppercase">
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
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-100 transition-colors hover:bg-teal-500/10 hover:text-teal-200"
              >
                <MapPin className="size-3.5 shrink-0 text-ink-400" aria-hidden />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
