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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  blocklist: ['table', 'table-header-group', 'table-row', 'table-cell'],
  darkMode: 'class',
}
