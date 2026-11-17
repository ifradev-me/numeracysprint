/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EduSpark v2: White & Pink as primary palette, green minimized
        edubg: '#F8EEF4',
        edudeep: '#EAD8E2',
        edushlight: '#FFFFFF',
        edushdark: '#DDBECB',
        edupink: {
          DEFAULT: '#CF336C',
          vibrant: '#CF336C',
          bright: '#DF477D',
          soft: '#F6CADA',
          light: '#FCE7F0',
          dark: '#B32657',
        },
        eduaccent: {
          DEFAULT: '#CF336C', // Vibrant Rose Pink as primary accent
          dark: '#B32657',
          light: '#FCE7F0',
        },
        edusuccess: '#16A34A', // Semantic green reserved only for correct quiz answers
        edutext: {
          DEFAULT: '#4A2A38',
          muted: '#7A5566',
        },
        edudanger: '#B04A5E',

        // Legacy compatibility aliases
        turquoise: {
          light: '#FCE7F0',
          surface: '#F8EEF4',
          DEFAULT: '#CF336C',
          dark: '#B32657',
          deep: '#B32657',
        },
        pink: {
          DEFAULT: '#CF336C',
          soft: '#EFA7C1',
          hover: '#DF477D',
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
        'raised': '7px 10px 24px rgba(205, 168, 185, 0.28), -6px -6px 16px rgba(255, 255, 255, 0.98)',
        'raised-sm': '4px 6px 14px rgba(205, 168, 185, 0.22), -4px -4px 12px rgba(255, 255, 255, 0.98)',
        'raised-lg': '10px 14px 28px rgba(205, 168, 185, 0.32), -8px -8px 20px rgba(255, 255, 255, 0.98)',
        'inset': 'inset 3px 3px 7px rgba(195, 155, 175, 0.24), inset -3px -3px 7px rgba(255, 255, 255, 0.9)',
        'inset-sm': 'inset 2px 2px 5px rgba(195, 155, 175, 0.18), inset -2px -2px 5px rgba(255, 255, 255, 0.9)',
        'accent-btn': '5px 5px 14px rgba(207, 51, 108, 0.32), -4px -4px 10px #FFFFFF',
      },
    },
  },
  plugins: [],
}
