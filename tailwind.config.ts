import type { Config } from "tailwindcss";

// Tailwind v4 is CSS-first — theme tokens (colors/fonts/shadows/animations)
// live in the `@theme` block in src/styles/index.css, not here. This file
// is kept as a no-op extension point in case a future need (e.g. a plugin)
// requires JS-side config.
export default {
  theme: {
    extend: {},
  },
} satisfies Config;
