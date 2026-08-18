import type { Transition } from "../../features/trips/types";

/** Dev-only: raw transitions JSON next to the rendered grid, so a change in
 * the grid/remarks can be checked against the exact backend data driving
 * it. Gated by VITE_SHOW_DEBUG_PANEL — see constants/debug.ts. */
export function TransitionsDebugPanel({ transitions }: { transitions: Transition[] }) {
  return (
    <div className="w-full max-w-sm shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-amber-400 uppercase">
        Debug: transitions ({transitions.length})
      </p>
      <pre className="max-h-[420px] overflow-auto font-mono text-[11px] leading-snug whitespace-pre-wrap break-words text-amber-200">
        {JSON.stringify(transitions, null, 2)}
      </pre>
    </div>
  );
}
