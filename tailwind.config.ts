import type { Config } from "tailwindcss";

const cjk = ["PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "system-ui", "sans-serif"];

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "var(--brand)", hover: "var(--brand-hover)", text: "var(--brand-text)" },
        "on-brand": "var(--on-brand)",
        success: "var(--success)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        ground: "var(--ground)",
        paper: { DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)", 2: "var(--paper-2)" },
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        field: "var(--field)",
        "on-field": { DEFAULT: "var(--on-field)", 2: "var(--on-field-2)" },
        border: "var(--border)",
      },
      fontFamily: {
        // Chinese falls back to the visitor's system CJK font.
        sans: ["var(--font-text)", ...cjk],
        display: ["var(--font-display)", ...cjk],
      },
      fontSize: {
        small: "var(--step-small)",
        body: "var(--step-body)",
        lead: "var(--step-lead)",
      },
    },
  },
  plugins: [],
};
export default config;
