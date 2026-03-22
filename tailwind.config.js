/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* background colors */
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        backgroundSec: 'rgb(var(--color-bg-sec) / <alpha-value>)',
        bgSecInverted: 'rgb(var(--color-bg-sec-inverted) / <alpha-value>)',

        /* text colors */
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',

        /* red colors */
        red700: 'rgb(var(--color-red-700) / <alpha-value>)',
        red600: 'rgb(var(--color-red-600) / <alpha-value>)',
        /* blue colors */
        blue800: 'rgb(var(--color-blue-800) / <alpha-value>)',
        blue500: 'rgb(var(--color-blue-500) / <alpha-value>)',
        blue400: 'rgb(var(--color-blue-400) / <alpha-value>)',
        /* green colors */
        green600: 'rgb(var(--color-green-600) / <alpha-value>)',
        green500: 'rgb(var(--color-green-500) / <alpha-value>)',

        /* orange colors */
        orange500: 'rgb(var(--color-orange-500) / <alpha-value>)',

        /* gray colors */
        gray600: 'rgb(var(--color-gray-600) / <alpha-value>)',
        gray300: 'rgb(var(--color-gray-300) / <alpha-value>)',
        gray200: 'rgb(var(--color-gray-200) / <alpha-value>)',
        gray100: 'rgb(var(--color-gray-100) / <alpha-value>)',
        gray50: 'rgb(var(--color-gray-50) / <alpha-value>)',

        /* neutral colors */
        neutral900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
        neutral800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
        neutral600: 'rgb(var(--color-neutral-600) / <alpha-value>)',
        neutral50: 'rgb(var(--color-neutral-50) / <alpha-value>)',
        neutral0: 'rgb(var(--color-neutral-0) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
