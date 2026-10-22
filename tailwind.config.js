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
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        chatgpt: {
          light: {
            bg: '#ffffff',
            canvas: '#f9f9f9',
            surface: '#f4f4f4',
            surfaceBorder: '#e5e5e5',
            textPrimary: '#0d0d0d',
            textSecondary: '#5d5d5d',
          },
          dark: {
            bg: '#212121',
            surface: '#171717',
            surfaceElevated: '#2f2f2f',
            surfaceBorder: '#383838',
            textPrimary: '#ececec',
            textSecondary: '#b4b4b4',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 60px -15px rgba(99, 102, 241, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
