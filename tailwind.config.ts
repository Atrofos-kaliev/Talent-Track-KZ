import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3F8CFF",
          light: "#63A0FF",
          darker: "#2A6ED9",
          foreground: colors.white,
        },
        secondary: {
          DEFAULT: colors.gray[300],
          light: colors.gray[200],
          darker: colors.gray[400],
          foreground: colors.gray[700],
        },
        background: {
          DEFAULT: "#F3F7FA",
          dark: colors.slate[900],
        },
        foreground: {
          DEFAULT: colors.slate[800],
          light: colors.slate[600],
          dark: colors.slate[100],
        },
        muted: {
          DEFAULT: colors.slate[500],
          dark: colors.slate[400],
        },
        card: {
          DEFAULT: colors.white,
          dark: colors.slate[800],
        },
        border: {
          DEFAULT: colors.gray[200],
          dark: colors.slate[700],
        },
        "danger-red": {
          DEFAULT: "#EF4444",
          light: "#F87171",
          darker: "#DC2626",
          foreground: colors.white,
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-main-bg-light": `linear-gradient(to bottom right, #F3F7FA, ${colors.blue[50]})`,
      },
      keyframes: {
        pingOnce: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.15)", opacity: "0.9" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".8" },
        },
      },
      animation: {
        pingOnce: "pingOnce 0.6s cubic-bezier(0, 0, 0.2, 1)",
        fadeIn: "fadeIn 0.3s ease-out",
        subtlePulse: "subtlePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        interactive: `0 0 10px -2px ${colors.gray[300]}`,
        "primary-glow": `0 4px 15px ${colors.blue[400]}40`,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;