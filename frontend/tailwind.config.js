/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#efc94c',
        netflixRed: '#e50914',
      }
    },
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'soft-zoom': {
          '0%, 100%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.15)' },
        },
        'infinite-scroll': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      animation: {
        'soft-zoom': 'soft-zoom 20s ease-in-out infinite',
        'infinite-scroll': 'infinite-scroll 2s linear infinite',
      }
    }
  }
}