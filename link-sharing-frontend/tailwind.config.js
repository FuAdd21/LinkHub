/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0d0f0d",
        card: "#141714",
        "card-foreground": "#f3f4f3",
        border: "rgba(255, 255, 255, 0.08)",
        "border-subtle": "rgba(255, 255, 255, 0.04)",
        primary: {
          DEFAULT: "#c6f035",
          foreground: "#0e1208",
          hover: "#b5de28",
          dim: "rgba(198, 240, 53, 0.15)",
        },
        secondary: {
          DEFAULT: "#1a1d1a",
          foreground: "#e4e7e4",
        },
        muted: {
          DEFAULT: "#181b18",
          foreground: "#8a918a",
        },
        accent: {
          DEFAULT: "#202420",
          foreground: "#ffffff",
        },
        destructive: "#ef4444",
        "chart-1": "#c6f035", // Electric lime
        "chart-2": "#22d3ee", // Cyan (Desktop)
        "chart-3": "#f97316", // Amber (Tablet)
        "chart-4": "#a855f7", // Purple
        "chart-5": "#ec4899", // Pink
        // Existing tokens backward compatibility
        "surface": "#141714",
        "surface-container": "#181c18",
        "surface-container-high": "#1f231f",
        "surface-container-low": "#111411",
        "surface-container-highest": "#262b26",
        "on-surface": "#f3f4f3",
        "outline": "#454b45",
        "outline-variant": "rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        "xl": "1.5rem",
        "2xl": "1.75rem",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "sans-serif"],
        headline: ["Manrope", "Inter", "sans-serif"],
        body: ["Manrope", "Inter", "sans-serif"],
        label: ["Manrope", "Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
