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
        navy: {
          950: '#070F1E',
          900: '#0B192C',
          800: '#152A47',
          700: '#1E3E62',
          600: '#2A5584',
          500: '#3B71AB',
        },
        ivory: {
          50: '#FFFDF9',
          100: '#FAF6ED',
          200: '#F4ECE0',
          300: '#E8DCC9',
        },
        gold: {
          300: '#F3E5AB',
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#946C08',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
