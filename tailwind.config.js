/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B', // Deep Navy
          primary: '#1C2541', // Lighter Navy
          secondary: '#3A506B', // Steel Blue
          accent: '#42B0D5', // Maersk Light Blue style
          light: '#F8F9FA', // Off white
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
