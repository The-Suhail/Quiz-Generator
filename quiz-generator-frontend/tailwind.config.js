/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#f3f6fd',
          dark: '#181a20',
        },
        foreground: {
          DEFAULT: '#232946',
          dark: '#f4f4f5',
        },
        primary: {
          DEFAULT: '#6366f1',
          dark: '#818cf8',
        },
        secondary: {
          DEFAULT: '#14b8a6',
          dark: '#2dd4bf',
        },
        card: {
          DEFAULT: '#fff',
          dark: '#232946',
        },
        muted: {
          DEFAULT: '#e0e7ef',
          dark: '#232946',
        },
        accent: {
          DEFAULT: '#fbbf24',
          dark: '#f59e42',
        },
        destructive: {
          DEFAULT: '#ef4444',
          dark: '#f87171',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground.DEFAULT'),
            a: { color: theme('colors.primary.DEFAULT') },
          },
        },
        dark: {
          css: {
            color: theme('colors.foreground.dark'),
            backgroundColor: theme('colors.background.dark'),
            a: { color: theme('colors.primary.dark') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 