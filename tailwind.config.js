/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./pages/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "3sm": { max: "1025px" },
      "2sm": { max: "975px" },
      usm: { max: "940px" },
      dsm: { max: "900px" },
      sm: { max: "770px" },
      ssm: { max: "718px" },
      md: { max: "699px" },
      mmd: { max: "659px" },
      "2md": { max: "510px" },
      "2usm": { max: "505px" },
      "3md": { max: "403px" },
    },
    extend: {
      backgroundImage: {
        donation: "url('/public/images/donation.png')",
        pattern: "url('/public/images/pattern.png')",
      },
    },
  },
  plugins: [],
};
