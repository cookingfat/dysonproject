/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'notification': 'slide-in-out 4s ease-in-out forwards',
        'float-up': 'float-up 1s ease-out forwards',
        'pulse-strong': 'pulse-strong 1.5s infinite',
      },
      keyframes: {
        'slide-in-out': {
          '0%': { transform: 'translateX(110%)', opacity: '0' },
          '15%': { transform: 'translateX(0)', opacity: '1' },
          '85%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(110%)', opacity: '0' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(1.5)' },
        },
        'pulse-strong': {
          '0%': { transform: 'scale(0.95)', 'box-shadow': '0 0 0 0 rgba(255, 255, 0, 0.7)' },
          '70%': { transform: 'scale(1.1)', 'box-shadow': '0 0 10px 20px rgba(255, 255, 0, 0)' },
          '100%': { transform: 'scale(0.95)', 'box-shadow': '0 0 0 0 rgba(255, 255, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
