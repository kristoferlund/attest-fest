/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme1: "#040D12",
        theme2: "#183D3D",
        theme3: "#668F7F",
        theme4: "#B8CCC4",
        "theme-accent": "#6F519A",
      },
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        handjet: ["Handjet", "cursive"],
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
