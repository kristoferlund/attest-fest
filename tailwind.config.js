/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme1: "#040D12",
        theme2: "#183D3D",
        theme3: "#5C8374",
        theme4: "#93B1A6",
      },
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        handjet: ["Handjet", "cursive"],
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
