// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC107',
          light: '#FFB300',
          dark: '#FFA000',
        },
        secondary: {
          DEFAULT: '#F4511E',
          light: '#D84315',
          dark: '#BF360C',
        },
        neutral: {
          50: '#FAF9F7',
          100: '#F5F3F0',
          200: '#EBE9E7',
          300: '#D6D4D2',
          400: '#A8A6A4',
          500: '#787674',
          600: '#5C5A58',
          700: '#444240',
          800: '#292524',
          900: '#1C1917',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
        },
        warning: {
          DEFAULT: '#FF9800',
          light: '#FFB74D',
        },
        danger: {
          DEFAULT: '#F44336',
          light: '#EF5350',
        },
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'warm': '0 4px 6px -1px rgba(255, 177, 0, 0.1), 0 2px 4px -2px rgba(255, 177, 0, 0.1)',
        'warm-lg': '0 10px 15px -3px rgba(255, 177, 0, 0.1), 0 4px 6px -4px rgba(255, 177, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
