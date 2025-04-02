/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Ensure this includes your React files
  ],
  theme: {
    extend: {},
    colors: {
      black: "#344054",
      darkBlack: "#101828",
      primary: "#6941C6",
      lightPurple: "#F8F6FF",
      darkPurple: "#F2E9FF",
      black2: "#1D2939",
      gray: "#667085",
      lightGreen: "#ECFDF3",
      darkGreen: "#027A48",
      purple: "#643FBC",
      white: "#fff",
      gray2: "#D0D5DD",
      gray3: "#F9F9FB",
      red: "red",
    },
    borderColor: {
      red: "red",
      purple: "#643FBC",
      gray: "#D0D5DD",
      gray2: "#EAECF0",
    },
    boxShadow: {
      shadow1: "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
    },
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "992px",
      // => @media (min-width: 992px) { ... }
      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }
      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }
      big: "1440px",
      // => @media (min-width: 1440px) { ... }
      sBig: "1600px",
      // => @media (min-width: 1440px) { ... }
      xBig: "1920px",
      // => @media (min-width: 1920px) { ... }
    },
  },
  plugins: [],
};
