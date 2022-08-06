/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "8xl": "0px 7px 29px 0px rgba(14, 165, 233, 0.2)",
        "9xl": "0px 7px 29px 0px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "hero-wave": "url('/img/wave.svg')",
        "hero-wave2": "url('/img/wave2.svg')",
        "hero-pillars": "url('/img/pillars.svg')",
        "hero-bg": "url('/img/top_bg.svg')",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
