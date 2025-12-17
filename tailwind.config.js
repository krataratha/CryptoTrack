/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: '#f5f6f7',
          100: '#e6e8ea',
          200: '#cfd3d7',
          300: '#a9b0b7',
          400: '#7c8692',
          500: '#596271',
          600: '#424a58',
          700: '#343a45',
          800: '#2a2f37',
          900: '#1c1f24',
          950: '#0f1114',
        },
        accent: {
          400: '#22d3ee', // cyan
          500: '#06b6d4',
          600: '#0891b2',
        },
        success: {
          400: '#2dd4bf',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      boxShadow: {
        'obsidian': '0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
