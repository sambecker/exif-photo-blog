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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
