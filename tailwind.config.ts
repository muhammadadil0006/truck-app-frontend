import type { Config } from "tailwindcss";

// Tailwind v4 auto-scans project files by default and needs no `content`
// globs here. This file exists as the place to extend the theme
// (colors/spacing/etc.) if the UI polish pass wants custom tokens later.
export default {
  theme: {
    extend: {},
  },
} satisfies Config;
