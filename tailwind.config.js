/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fafafa",
        lightGray: "#dddfe9",
        danger: "#e06964",
        success: "#88C273",
        babyBlue: "#85bcff",
      },
      fontSize: {
        textTitle: "1.5rem",
        textSubtitle: "1.2rem",
      },
    },
  },
  plugins: [],
};
