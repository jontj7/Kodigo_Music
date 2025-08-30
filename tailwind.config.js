// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Fondo base y superficie
        base: {
          900: "#0B0F1A", // fondo principal
          800: "#0F1524",
        },
        card: "#121A2B",

        // Marca inspirada en tu logo (cyan → fucsia)
        brand: {
          50:  "#EAFBFF",
          100: "#CFF6FF",
          200: "#9FEAFF",
          300: "#6DD6FF",
          400: "#46B7FF",
          500: "#2AC0E8",   // cyan principal
          600: "#1FA1D1",
          700: "#1A86B0",
          800: "#166C8F",
          900: "#11506A",
        },
        accent: {
          400: "#D46BFF",
          500: "#C93FFF",   // fucsia principal
          600: "#AE2CE6",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.25)",
        glow: "0 0 24px rgba(42,192,232,0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #2AC0E8 0%, #C93FFF 100%)",
        "brand-radial": "radial-gradient(60% 60% at 50% 20%, rgba(41,192,232,0.25) 0%, rgba(201,63,255,0.12) 45%, transparent 100%)",
      },
      keyframes: {
        glow: { "0%,100%": { opacity: 0.5 }, "50%": { opacity: 1 } },
      },
      animation: {
        glow: "glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
