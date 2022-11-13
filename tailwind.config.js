/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/**/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./pages/**/**/*.{js,jsx,ts,tsx}",
    "./pages/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      "4smm": { min: "1450px" },
      "4sm": {min: "1240px"},
      "2iism": { min: "1400px" },
      "4zsm": { min: "950px" },
      "42sm": {min: "800px"},
      "3sm": { max: "1025px" },
      "2ism": { min: "975px" },
      "2sm": { max: "975px" },
      usm: { max: "940px" },
      dsm: { max: "900px" },
      sm: { max: "770px" },
      ssm: { max: "718px" },
      md: { max: "699px" },
      mmd: { max: "659px" },
      "2md": { max: "510px" },
      "2mmd": {max: "550px"},
      "2usm": { max: "505px" },
      "3mdd": { max: "420px" },
      "3md": { max: "403px" },
    },
    extend: {
      backgroundImage: {
        donation: "url('../public/images/donation.png')",
        pattern: "url('../public/images/pattern.png')",
        pattern2: "url('../public/images/pattern2.png')",
        pattern3: "radial-gradient(#F28585, transparent)",
        overlay: "linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 65%, rgba(255, 255, 255, 1) 100%)"
      },
      backgroundSize: {
        patternsize: "160px"
      },
      fontFamily: {
        ubuntu: "'Ubuntu', sans-serif",
        bajan: "'Baloo Bhaijaan', cursive"
      }
    },
  },
  plugins: [],
};
