/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#080C18',
        'sidebar-bg': '#101729',
        'card-bg': '#101729',
        'primary-text': '#F1F5F9',
        'secondary-text': '#94A3B8',
        'border-color': '#334155',
        'accent-blue': '#3B82F6',
        'accent-green': '#22C55E',
        'accent-red': '#EF4444',
        'accent-teal': '#14B8A6',
        'accent-pink': '#EC4899',
        'accent-lime': '#C4F042',
        'pro-bg-start': '#4338CA',
        'pro-bg-end': '#6D28D9',
        'pro-button': '#1EE2B3',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}