import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Editorial Travel Atelier Palette (Light & Dark)
        background: {
          DEFAULT: "var(--background, #fcf9f4)",
          dark: "#131313",
        },
        surface: {
          DEFAULT: "var(--surface, #fcf9f4)",
          dim: "#dcdad5",
          bright: "#fcf9f4",
          container: {
            lowest: "#ffffff",
            low: "#f6f3ee",
            DEFAULT: "#f0ede9",
            high: "#ebe8e3",
            highest: "#e5e2dd",
          },
          variant: "#e5e2dd",
          tint: "#306767",
        },
        "on-surface": {
          DEFAULT: "var(--on-surface, #1c1c19)",
          variant: "#404848",
        },
        primary: {
          DEFAULT: "#003434",
          container: "#0f4c4c",
          "on-container": "#85bbbb",
          foreground: "#ffffff",
          fixed: "#b5edec",
          "fixed-dim": "#9ad0d0",
          hover: "#135858",
        },
        secondary: {
          DEFAULT: "#286867",
          container: "#afeeed",
          "on-container": "#2f6e6e",
          foreground: "#ffffff",
          fixed: "#afeeed",
          "fixed-dim": "#94d1d1",
        },
        tertiary: {
          DEFAULT: "#4a230f",
          container: "#653923",
          "on-container": "#e2a487",
          fixed: "#ffdbcc",
          "fixed-dim": "#f9b89a",
        },
        outline: {
          DEFAULT: "#707978",
          variant: "#bfc8c8",
        },
        border: {
          DEFAULT: "#1A1A1A",
          subtle: "#E5E0DA",
        },
      },
      fontFamily: {
        serif: ["EB Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        headline: ["EB Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        card: "32px",
        hero: "60px",
        full: "9999px",
      },
      spacing: {
        "gutter-xs": "0.5rem",
        "gutter-sm": "1rem",
        "gutter-md": "1.5rem",
        "gutter-lg": "2.5rem",
        "gutter-xl": "4rem",
        "margin-mobile": "1.25rem",
        "margin-tablet": "2.5rem",
        "margin-desktop": "5rem",
        "content-max-width": "84rem",
      },
    },
  },
  plugins: [],
};

export default config;
