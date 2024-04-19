/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx,mdx}',
    './styles/**/*.{css, ts}',
    './components/**/*.{js, jsx,ts,tsx,mdx}',
    './app/**/*.{ts,tsx,mdx}',
    `./public/**/*.html`,
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
