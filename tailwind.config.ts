import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#070b12",
        surface: "#0d1420",
        border: "rgba(255, 255, 255, 0.07)",
        primary: "#f1f5f9",
        muted: "#94a3b8",
        cyan: "#22d3ee",
        sky: "#38bdf8",
        green: "#4ade80"
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        glow: "0 0 34px rgba(34, 211, 238, 0.12)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
