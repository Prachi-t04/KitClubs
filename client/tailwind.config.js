/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1e40af', // Primary Blue
          800: '#1e3a8a',
          900: '#172554',
        },
        purple: {
          600: '#7c3aed', // Accent Purple
        },
        sky: {
          500: '#0ea5e9', // Sky Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
