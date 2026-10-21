import type { Config } from "tailwindcss";

const cjk = ["PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "system-ui", "sans-serif"];

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Channel variables so opacity modifiers (bg-brand/10) work.
        night: "rgb(var(--night-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        raised: "var(--raised)",
        tint: "rgb(var(--tint-rgb) / <alpha-value>)",
        line: { DEFAULT: "var(--line)", 2: "var(--line-2)" },
        fg: { DEFAULT: "rgb(var(--fg-rgb) / <alpha-value>)", 2: "var(--fg-2)", 3: "var(--fg-3)" },
        brand: { DEFAULT: "rgb(var(--brand-rgb) / <alpha-value>)", hover: "var(--brand-hover)", text: "var(--brand-text)" },
        "on-brand": "var(--on-brand)",
        amber: "rgb(var(--amber-rgb) / <alpha-value>)",
        success: "var(--success)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
      },
      fontFamily: {
        // Chinese falls back to the visitor's system CJK font.
        sans: ["var(--font-sans)", ...cjk],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        small: "var(--step-small)",
        body: "var(--step-body)",
        lead: "var(--step-lead)",
      },
      borderRadius: {
        card: "var(--radius)",
      },
    },
  },
  plugins: [],
};
export default config;
