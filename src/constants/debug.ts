// Only VITE_-prefixed env vars are exposed to client code by Vite — see
// frontend/README.md for the full env var list. Off by default; set
// VITE_SHOW_DEBUG_PANEL=true in .env locally to validate raw transitions
// data against the rendered grid during development.
export const SHOW_DEBUG_PANEL = import.meta.env.VITE_SHOW_DEBUG_PANEL === "true";
