import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.625rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      colors: {
        ring: 'rgb(26 137 23 / 0.18)',
        border: 'rgb(230 230 230)',
        input: 'rgb(230 230 230)',
        background: 'rgb(250 250 250)',
        foreground: 'rgb(36 36 36)',
        primary: {
          DEFAULT: 'rgb(26 137 23)',
          foreground: 'rgb(255 255 255)',
        },
        muted: {
          DEFAULT: 'rgb(242 242 242)',
          foreground: 'rgb(107 107 107)',
        },
        accent: {
          DEFAULT: 'rgb(242 242 242)',
          foreground: 'rgb(36 36 36)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'in': 'fadeIn 0.15s ease-out',
        'out': 'fadeOut 0.15s ease-in',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeOut: { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [tailwindAnimate],
}
