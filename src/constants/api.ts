// Only VITE_-prefixed env vars are exposed to client code by Vite — see
// frontend/README.md for the full env var list.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
