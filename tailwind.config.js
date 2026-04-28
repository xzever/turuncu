/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    // Anayasa Madde 3.1 — senkron kaynak: src/lib/breakpoints.ts
    // App shell (SiteHeader): Tailwind `lg` ve üstü (≥1280px, ~13").
    screens: {
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1440px",
      "2xl": "1920px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      /**
       * Tailwind `text-*` sınıfları → src/styles/tokens/typography.css fluid ölçeği.
       * Eşleme: TW `text-xs` ≈ --text-2xs, `text-sm` ≈ --text-xs (isimler farklı; tek kaynak aynı clamp’ler).
       */
      fontSize: {
        xs: ["var(--text-2xs)", { lineHeight: "var(--leading-normal)" }],
        sm: ["var(--text-xs)", { lineHeight: "var(--leading-normal)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-snug)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-snug)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-tight)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-tight)" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
        "6xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
        "7xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
        "8xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
        "9xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
      },
      colors: {
        "solar-orange": "#f97316",
        "solar-deep": "#0b1220",
        "solar-blue": "#0f172a",
        "solar-graph": "#1d4ed8",
      },
      boxShadow: {
        "soft": "0 20px 45px -25px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
