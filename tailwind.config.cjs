/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/output/css",
    "./public/*.{html,js,css}",
    "./public/**/*.{html,js,css}",
    "./views/*.ejs",
    "./views/**/*.ejs",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
