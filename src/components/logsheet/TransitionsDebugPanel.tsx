import type { Transition } from "../../features/trips/types";

/** Dev-only: raw transitions JSON next to the rendered grid, so a change in
 * the grid/remarks can be checked against the exact backend data driving
 * it. Gated by VITE_SHOW_DEBUG_PANEL — see constants/debug.ts. */
export function TransitionsDebugPanel({ transitions }: { transitions: Transition[] }) {
  return (
    <div className="w-full max-w-sm shrink-0 rounded-lg border border-amber-300 bg-amber-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase text-amber-700">
        Debug: transitions ({transitions.length})
      </p>
      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words text-[11px] leading-snug text-amber-900">
        {JSON.stringify(transitions, null, 2)}
      </pre>
    </div>
  );
}
