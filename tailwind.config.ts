import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    "text-wuxing-metal",
    "text-wuxing-wood",
    "text-wuxing-water",
    "text-wuxing-fire",
    "text-wuxing-earth"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        paper: "#f8faf9",
        line: "#d9e2df",
        jade: "#227c70",
        cinnabar: "#b34538",
        brass: "#b98124",
        wuxing: {
          metal: "#b8860b",
          wood: "#2e7d4f",
          water: "#1d5f8a",
          fire: "#c0392b",
          earth: "#9a6b1a"
        }
      }
    }
  },
  plugins: []
};

export default config;
