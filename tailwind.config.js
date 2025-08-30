/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8fff6",
          100: "#c9ffe8",
          200: "#9fffd7",
          300: "#62f9be",
          400: "#2beaa1",
          500: "#10d19d", // primary
          600: "#0db187",
          700: "#0a8d6f",
          800: "#086f59",
          900: "#065a49",
        },
        surface: "#0b0f14",
        card: "#121922",
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};