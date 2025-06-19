import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
      colors: {
        // Palette basata sulla mappa del parco
        "park-green": {
          50: "#f0ffe6",
          100: "#daffcc",
          200: "#b8ff99",
          300: "#8aff5c",
          400: "#66ff33",
          500: "#4de01a",
          600: "#3cb30e",
          700: "#2d850a",
          800: "#236809",
          900: "#1c5608",
        },
        "park-red": {
          500: "#e63946",
        },
        "park-yellow": {
          500: "#ffbe0b",
        },
        "park-blue": {
          500: "#3a86ff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    
  },
  plugins: [animate],
};
