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
        placeholderText: 'rgb(var(--color-placeholder) / <alpha-value>)',
        fieldBorder: 'rgb(var(--default-border) / <alpha-value>)',
        shadowColor: 'rgb(var(--color-shadow) / <alpha-value>)',

        /* red colors */
        red: {
          600: 'rgb(var(--color-red-600) / <alpha-value>)',
          700: 'rgb(var(--color-red-700) / <alpha-value>)',
          500: 'rgb(var(--color-red-500) / <alpha-value>)',
        },
        /* blue colors */
        blue: {
          400: 'rgb(var(--color-blue-400) / <alpha-value>)',
          500: 'rgb(var(--color-blue-500) / <alpha-value>)',
          800: 'rgb(var(--color-blue-800) / <alpha-value>)',
        },
        /* green colors */
        green: {
          500: 'rgb(var(--color-green-500) / <alpha-value>)',
          600: 'rgb(var(--color-green-600) / <alpha-value>)',
        },
        /* orange colors */
        orange: {
          400: 'rgb(var(--color-orange-400) / <alpha-value>)',
          500: 'rgb(var(--color-orange-500) / <alpha-value>)',
        },
        /* gray colors */
        gray: {
          50: 'rgb(var(--color-gray-50) / <alpha-value>)',
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
        },
        /* neutral colors */
        neutral: {
          0: 'rgb(var(--color-neutral-0) / <alpha-value>)',
          50: 'rgb(var(--color-neutral-50) / <alpha-value>)',
          600: 'rgb(var(--color-neutral-600) / <alpha-value>)',
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
