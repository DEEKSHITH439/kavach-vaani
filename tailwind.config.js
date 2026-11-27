/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bharat: {
          saffron: '#FF671F',
          white: '#FFFFFF',
          green: '#046A38',
          navy: '#06038D',
          dark: '#0F172A',
          card: '#1E293B',
          amber: '#F59E0B'
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(255, 103, 31, 0.5)' },
          '50%': { transform: 'scale(1.08)', boxShadow: '0 0 45px rgba(255, 103, 31, 0.85)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
