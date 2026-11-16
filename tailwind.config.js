/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EduSpark v2 Neumorphism Color Palette
        edubg: '#F9E4EC',
        edudeep: '#F3D5E1',
        edushlight: '#FFF7FA',
        edushdark: '#DDB5C6',
        edupink: {
          DEFAULT: '#EFA7C1',
          soft: '#F6CADA',
        },
        eduaccent: {
          DEFAULT: '#1B6B58',
          dark: '#124D3F',
        },
        edutext: {
          DEFAULT: '#4A2A38',
          muted: '#7A5566',
        },
        edudanger: '#B04A5E',

        // Legacy compatibility aliases
        turquoise: {
          light: '#F3D5E1',
          surface: '#F9E4EC',
          DEFAULT: '#1B6B58',
          dark: '#124D3F',
          deep: '#124D3F',
        },
        pink: {
          soft: '#EFA7C1',
          hover: '#E291AE',
          light: '#F6CADA',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Figtree', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'raised': '8px 8px 18px #DDB5C6, -8px -8px 18px #FFF7FA',
        'raised-sm': '4px 4px 10px #DDB5C6, -4px -4px 10px #FFF7FA',
        'raised-lg': '12px 12px 24px #DDB5C6, -12px -12px 24px #FFF7FA',
        'inset': 'inset 5px 5px 10px #DDB5C6, inset -5px -5px 10px #FFF7FA',
        'inset-sm': 'inset 3px 3px 6px #DDB5C6, inset -3px -3px 6px #FFF7FA',
        'accent-btn': '5px 5px 12px rgba(18,77,63,0.35), -4px -4px 10px #FFF7FA',
      },
    },
  },
  plugins: [],
}
