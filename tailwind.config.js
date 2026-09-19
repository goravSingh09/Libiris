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
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#0d9488',
          600: '#0f766e',
          900: '#134e4a',
          navy: '#0B0F19',
          navyLight: '#111827',
          surface: '#182032',
          surfaceLight: '#1F293D',
          border: '#2A364F'
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EFE9DC',
          300: '#DFD5C0',
          800: '#4A3E2D',
          900: '#2A2218'
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706'
        },
        reader: {
          lightBg: '#FFFFFF',
          lightText: '#18181B',
          sepiaBg: '#F7F1E3',
          sepiaText: '#3D2F1D',
          sepiaMuted: '#7D6A53',
          darkBg: '#151922',
          darkText: '#E2E8F0',
          darkMuted: '#94A3B8',
          nightBg: '#090B10',
          nightText: '#CBD5E1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'book': '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        'book-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.4), 0 10px 15px -5px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 35px -5px rgba(245, 158, 11, 0.25)',
        'glow-indigo': '0 0 35px -5px rgba(79, 70, 229, 0.3)'
      }
    },
  },
  plugins: [],
}
