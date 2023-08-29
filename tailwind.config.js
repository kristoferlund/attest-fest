/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme1: "#FAF1E4",
        theme2: "#CEDEBD",
        theme3: "#9EB384",
        theme4: "#435334",
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
