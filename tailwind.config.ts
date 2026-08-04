import type { Config } from "tailwindcss";

/**
 * AGENCY design tokens.
 *
 * Palette is drawn from the logo: sage green and burnt orange on a warm
 * off-white. Warm and inviting for a small business owner, but with enough
 * contrast and structure to feel like a serious financial tool.
 *
 * The legacy semantic names (primary, secondary, background, foreground,
 * light-gray) are kept and remapped onto the new palette, so the existing
 * screens re-theme without touching every file. New work should prefer the
 * named scales below.
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sage — the brand green. Calm, grounding. Structure and navigation.
        sage: {
          50: "#F2F6EF",
          100: "#E3ECDE",
          200: "#C9DBC0",
          300: "#A3C293", // logo mark
          400: "#86AC73",
          500: "#6B9159",
          600: "#547344",
          700: "#415932",
          800: "#2F4124",
          900: "#1F2C18",
        },
        // Ember — the burnt orange from the wordmark. Actions and emphasis.
        ember: {
          50: "#FDF4E9",
          100: "#FAE6CC",
          200: "#F2C88C",
          300: "#E5A54F",
          400: "#D48B26",
          500: "#C87A17", // logo wordmark
          600: "#A96313", // text-safe on white (4.9:1)
          700: "#854D0F",
          800: "#63390B",
        },
        // Warm neutrals. Clay-tinted rather than blue-grey, to keep it warm.
        clay: {
          50: "#FBF8F3", // page canvas
          100: "#F5F0E7",
          200: "#E8E1D6", // hairlines, borders
          300: "#D6CCBC",
          400: "#A89C8B",
          500: "#7D7263",
          600: "#6B6259", // muted text
          700: "#4A433B",
          800: "#2B2722", // primary text
          900: "#1A1713",
        },
        // Feedback colors, warm-shifted to sit with the palette.
        success: "#547344",
        warning: "#D48B26",
        danger: "#B3452F",
        info: "#3D6B7D",

        // --- Legacy aliases: remapped, not removed. ---
        primary: "#C87A17",            // was amber #ffbd5a
        "primary-accent": "#C87A17",
        "primary-foreground": "#FFFFFF",
        secondary: "#2F4124",          // was #476c2e, now sage-800
        "secondary-accent": "#6B9159",
        "light-gray": "#C9DBC0",       // was amber; now sage-200 for sidebar headers
        "light-background": "#FBF8F3",
        background: "#FBF8F3",
        foreground: "#2B2722",
        "dark-foreground": "#2B2722",
        surface: "#FFFFFF",
        border: "#E8E1D6",
        muted: "#6B6259",
        "invoice-blue": "#2F4124",     // invoices now use brand sage, not navy
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "0.875rem",
        control: "0.5rem",
      },
      boxShadow: {
        // Warm-tinted shadows. A neutral black shadow reads cold on cream.
        card: "0 1px 2px rgba(43, 39, 34, 0.04), 0 4px 16px rgba(43, 39, 34, 0.06)",
        lift: "0 2px 4px rgba(43, 39, 34, 0.06), 0 12px 32px rgba(43, 39, 34, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
