/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Quicksand", "sans-serif"],
        body: ["Lexend", "sans-serif"],
      },
      colors: {
        brand: {
          cream: "#F8EADC",
          blush: "#FAD0D5",
          rose: "#F59BAD",
          periwinkle: "#778BBE",
          sky: "#9EDEF9",
          ink: "#2B2438",
        },
      },
    },
  },
  plugins: [],
}
