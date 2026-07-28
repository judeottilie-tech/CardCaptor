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
        // Navy+neon base. `ink` is the near-black page background, `cream`
        // is the light "paper" surface color for panels/inputs. Decorative
        // stickers (Heart/Sparkle instances on Login/Register/BinderPageList)
        // pass their own hardcoded soft-pastel hex directly as a `color`
        // prop — they aren't Tailwind classes, so they're unaffected by
        // this token set either way.
        brand: {
          ink: "#000336",
          cream: "#FDF8E6",
          rose: "#F913DE",
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
