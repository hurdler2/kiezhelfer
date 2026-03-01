import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Armut.com renk paleti
        brand: {
          50:  "#E2F8E8",
          100: "#C4F1D1",
          200: "#8AE4A5",
          300: "#51D67A",
          400: "#2DCB56",
          500: "#2CB34F",
          600: "#249944",
          700: "#1C7F38",
          800: "#14632C",
          900: "#0E0F11",
          950: "#080909",
        },
      },
    },
  },
  plugins: [],
};
export default config;
