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
        // Paleta FinanzasJY — prefijo jy-
        "jy-bg":        "#0d1b2a",   // Fondo principal
        "jy-card":      "#112240",   // Cards y paneles
        "jy-input":     "#1a3358",   // Inputs y áreas interactivas
        "jy-accent":    "#3b82f6",   // Azul principal (CTAs)
        "jy-green":     "#22c55e",   // Ingresos, positivo
        "jy-red":       "#ef4444",   // Egresos/gastos, negativo
        "jy-amber":     "#f59e0b",   // Inversiones, alertas
        "jy-purple":    "#a855f7",   // Préstamos
        "jy-text":      "#e2e8f0",   // Texto principal
        "jy-secondary": "#94a3b8",   // Texto secundario
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans:    ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
