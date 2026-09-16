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
        background: "#0B0A07",
        card: "#13120D",
        "card-foreground": "#f3f4f3",
        border: "rgba(255, 255, 255, 0.08)",
        "border-subtle": "rgba(255, 255, 255, 0.04)",
        primary: {
          DEFAULT: "#c6f035",
          foreground: "#0B0A07",
          hover: "#b5de28",
          dim: "rgba(198, 240, 53, 0.15)",
        },
        secondary: {
          DEFAULT: "#181711",
          foreground: "#e4e7e4",
        },
        muted: {
          DEFAULT: "#181711",
          foreground: "#8a918a",
        },
        accent: {
          DEFAULT: "#1d1c15",
          foreground: "#ffffff",
        },
        destructive: "#ef4444",
        "chart-1": "#c6f035", // Electric lime
        "chart-2": "#22d3ee", // Cyan (Desktop)
        "chart-3": "#f97316", // Amber (Tablet)
        "chart-4": "#a855f7", // Purple
        "chart-5": "#ec4899", // Pink
        // Existing tokens backward compatibility
        "surface": "#13120D",
        "surface-container": "#181711",
        "surface-container-high": "#1e1d16",
        "surface-container-low": "#0B0A07",
        "surface-container-highest": "#24231b",
        "on-surface": "#f3f4f3",
        "outline": "#454b45",
        "outline-variant": "rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        "xl": "1.5rem",
        "2xl": "1.75rem",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        title: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        subtitle: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
