const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '390px',
      ...defaultTheme.screens,
    },
    fontSize: {
      'xs': '0.75rem',
      'sm': ['0.825rem', '1.15rem'],
      'base': ['0.875rem', '1.275rem'],
      'lg': ['0.925rem', '1.05rem'],
      'xl': '1rem',
      '2xl': '1.1rem',
      '3xl': ['1.3rem', '1.7rem'],
    },
    extend: {
      fontFamily: {
        'mono': ['var(--font-ibm-plex-mono)', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        'rotate-pulse':
          'rotate-pulse 0.75s linear infinite normal both running',
      },
      keyframes: {
        'rotate-pulse': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(0.8)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
