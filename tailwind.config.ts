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
        // FinanzasJY — "Professional Dark Trade" palette
        "jy-bg":        "#120e06",   // Fondo principal (deepest charcoal)
        "jy-card":      "#201b12",   // Cards y paneles
        "jy-input":     "#2f2920",   // Inputs, interacción hover
        "jy-border":    "#4f4634",   // Outline variant (1px borders)
        "jy-accent":    "#f3ba2f",   // Binance Yellow — CTAs, highlights
        "jy-accent-hi": "#ffda91",   // Accent claro (hover, ring)
        "jy-green":     "#0ecb81",   // INGRESO — verde financiero
        "jy-red":       "#f6465d",   // EGRESO/GASTO — rojo financiero
        "jy-amber":     "#f59e0b",   // INVERSION
        "jy-purple":    "#a855f7",   // PRESTAMO
        "jy-text":      "#ece1d2",   // Texto principal
        "jy-secondary": "#9c8f7a",   // Texto secundario
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
