/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        lilac: {
          light: '#E2DBF8',
          DEFAULT: '#D8D2F0',
          dark: '#C9C2E8',
        },
      },
    },
  },
  plugins: [],
}
