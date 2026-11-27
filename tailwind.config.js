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
          'saffron-light': '#FFF5EE',
          'saffron-muted': '#EA580C',
          white: '#FFFFFF',
          ivory: '#FAFAF9',
          green: '#046A38',
          'green-light': '#F0FDF4',
          'green-emerald': '#059669',
          navy: '#06038D',
          'navy-deep': '#0B132B',
          'navy-slate': '#1E293B',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', '"Nirmala UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'soft-md': '0 6px 16px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'glow-saffron': '0 0 25px -4px rgba(255, 103, 31, 0.45)',
        'glow-green': '0 0 25px -4px rgba(4, 106, 56, 0.45)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.6s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(255, 103, 31, 0.35)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 38px rgba(255, 103, 31, 0.65)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.85)', opacity: '0.9' },
          '100%': { transform: 'scale(2.3)', opacity: '0' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'floatGentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
