import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FinanzasJY — "Professional Dark Trade" palette (Binance-style)
        "jy-bg":        "#141621",   // Neutral background — dark navy
        "jy-card":      "#1E2329",   // Secondary surface — card/panel
        "jy-input":     "#2B3139",   // Interaction layer — inputs, hover
        "jy-border":    "#363C45",   // Subtle 1px outlines
        "jy-accent":    "#F3BA2F",   // Primary — Binance yellow (CTAs)
        "jy-accent-hi": "#FFDEA0",   // Accent hover / ring
        "jy-cyan":      "#59D0FF",   // Tertiary — info / highlights
        "jy-green":     "#0ECB81",   // INGRESO — financial green
        "jy-red":       "#F6465D",   // EGRESO/GASTO — financial red
        "jy-amber":     "#F3BA2F",   // INVERSION (mismo que accent)
        "jy-purple":    "#A855F7",   // PRESTAMO
        "jy-text":      "#EAECEF",   // Primary text (cool white)
        "jy-secondary": "#848E9C",   // Secondary text (cool gray)
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        sans:    ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
