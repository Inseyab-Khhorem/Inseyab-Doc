/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: {
          50: '#FFFEF7',
          100: '#FEFCE8',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FFD400', // Primary theme color
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
      },
    },
  },
  plugins: [],
};