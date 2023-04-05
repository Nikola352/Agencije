/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
        colors: {
            primary: {
                300: "#FA9D21",
                500: "#FA7921",
                700: "#FA5521"
            } ,
            secondary: "#616163",
            accent: "#5ADBFF",
            success: "#7FB069",
            error: "#FF5A5F"
        }
    },
  },
  plugins: [],
}
