/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        modern: ['Computer Modern', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-orange': '#FF5722',
        'vueGreen': '#42d392',
        'vueBlue': '#647eff',
        'background': '#415DA2',
        'silver': '#C0C0C0', // silver
        'button': '#3399FF', //vibrant blue
        'teal': '#008080',
        'middlegreen': '#4cb8b4'
      }
    },
  },
  darkMode: 'class',
}
