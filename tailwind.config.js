/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        backgroundSec: 'rgb(var(--color-bg-sec) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        placeholderText: 'rgb(var(--color-placeholder) / <alpha-value>)',
        fieldBorder: 'rgb(var(--default-border) / <alpha-value>)',
        shadowColor: 'rgb(var(--color-shadow) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
