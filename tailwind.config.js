/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006A6A', // Verde azulado principal
          light: '#53D6D5',
          dark: '#003737',
        },
        secondary: {
          DEFAULT: '#4A6363', // Tono neutro
          light: '#D2E8E7',
          dark: '#1D3534',
        },
        tertiary: {
          DEFAULT: '#4A607B', // Acento sutil
          light: '#D2E4FF',
          dark: '#1C314A',
        },
        background: '#F4FAFA', // Fondo general (casi blanco)
        surface: '#FDFDFB',   // Fondo de las tarjetas (blanco puro)
        'on-primary': '#FFFFFF', // Texto sobre color primario
        'on-secondary': '#FFFFFF', // Texto sobre color secundario
        'on-tertiary': '#FFFFFF', // Texto sobre color terciario
        'on-background': '#161D1D',// Texto principal
        'on-surface': '#161D1D',  // Texto sobre tarjetas
        'surface-variant': '#DAE5E4', // Borde o fondo sutil
        'on-surface-variant': '#3F4948', // Texto secundario
        outline: '#6F7978',
        error: '#BA1A1A',
        'on-error': '#FFFFFF',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
}