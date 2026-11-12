/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turquoise: {
          light: '#E6F8F9',
          surface: '#F0FAFB',
          DEFAULT: '#2DB4BE',
          dark: '#1A8A93',
          deep: '#126168',
        },
        pink: {
          soft: '#FF6B9A',
          hover: '#FF5288',
          light: '#FFF0F5',
        },
        offwhite: '#F8FAFA',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(45, 180, 190, 0.08)',
        'card': '0 10px 25px -5px rgba(26, 138, 147, 0.15), 0 8px 10px -6px rgba(26, 138, 147, 0.1)',
        'card-blue': '0 14px 30px -4px rgba(26, 138, 147, 0.28)',
        'card-hover': '0 20px 35px -6px rgba(26, 138, 147, 0.35)',
        'pink': '0 8px 20px -3px rgba(255, 107, 154, 0.35)',
        'pink-hover': '0 12px 26px -3px rgba(255, 107, 154, 0.45)',
        'glow': '0 0 25px rgba(45, 180, 190, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop-in': 'pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
