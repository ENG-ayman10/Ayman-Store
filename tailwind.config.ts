import type { Config } from "tailwindcss";

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
        gold: {
          50: "#fdfbf7",
          100: "#f9f4ea",
          200: "#f2e4cb",
          300: "#e9cfa4",
          400: "#deb575",
          500: "#cf9b4d",
          600: "#b97f37",
          700: "#96612d",
          800: "#794d2a",
          900: "#644026",
          950: "#382112",
        },
        emerald: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        "luxury": "0 10px 30px -10px rgba(207, 155, 77, 0.2)",
        "luxury-lg": "0 20px 40px -15px rgba(207, 155, 77, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
