import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          hover: "var(--brand-hover)",
          text: "var(--brand-text)",
          soft: "var(--brand-soft)",
        },
        "on-brand": "var(--on-brand)",
        success: "var(--success)",
        danger: "var(--danger)",
        canvas: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        ink: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      borderRadius: {
        "ui-sm": "8px",
        "ui-md": "12px",
        "ui-lg": "20px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      fontFamily: {
        // Chinese falls back to the visitor's system CJK font: every OS that
        // reads /cn ships one, and a webfont cost ~465 KB of CSS on every locale.
        sans: [
          "var(--font-inter)",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Noto Sans SC",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
