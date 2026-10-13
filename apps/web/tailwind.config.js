/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0B0C0E',
          900: '#121316',
          850: '#15171C',
          800: '#1A1C23',
          700: '#262933',
          600: '#343846',
          500: '#474D5E'
        },
        flowgreen: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
