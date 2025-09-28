/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/common/renderer/**/*.{js,jsx,ts,tsx}",
    "./app/common/index.html",
  ],
  theme: {
    extend: {
      colors: {
        ocbc: {
          primary: '#E60012',
          secondary: '#333333',
          background: '#F8F8F8',
          light: '#ffffff',
          dark: '#191919',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

