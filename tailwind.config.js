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
      'xs':   ['0.75rem', '1rem'],          // 12px on 16px
      'sm':   ['0.84375rem', '1.1875rem'],  // 13.5px on 19px [Default: mobile]
      'base': ['0.875rem', '1.25rem'],      // 14px on 20px   [Default: desktop]
      'lg':   ['1rem', '1.25rem'],          // 16px on 20px
      'xl':   ['1.125rem', '1.25rem'],      // 18px on 20px
      '2xl':  ['1.25rem', '1.25rem'],       // 20px on 20px
      '3xl':  ['1.5rem', '1.5rem'],         // 24px on 24px
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
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
