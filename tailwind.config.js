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
        mu: {
          forest: '#0A3B2C',
          emerald: '#126149',
          deep: '#0F4D3A',
          olive: '#4D6C37',
          'olive-light': '#739557',
          gold: '#C59A3F',
          'gold-light': '#DFB76C',
          'gold-dark': '#9A7426',
          bronze: '#8F6623',
          sand: '#F6F3EB',
          navy: '#1A365D',
          'navy-light': '#2A4365',
        },
        surface: {
          50: '#F8FAF9',
          100: '#F0F4F2',
          200: '#E1E9E5',
          800: '#152520',
          900: '#0C1714',
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'academic': '0 4px 20px -2px rgba(10, 59, 44, 0.08), 0 2px 6px -1px rgba(10, 59, 44, 0.04)',
        'academic-lg': '0 10px 30px -4px rgba(10, 59, 44, 0.12), 0 4px 10px -2px rgba(10, 59, 44, 0.06)',
        'gold-glow': '0 0 15px rgba(197, 154, 63, 0.35)',
      }
    },
  },
  plugins: [],
}

