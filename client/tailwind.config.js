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
          ink: "#000336",
          cream: "#FDF8E6",
          rose: "#d137bf",
          blush: "#FD8CEA",
          periwinkle: "#7971FC",
          sky: "#2AD3DC",
          lavender: "#C2BBFA",
          mint: "#76F4BD",
          orange: "#FAB323",
          yellow: "#FEFA04",
        },
      },
    },
  },
  plugins: [],
}
