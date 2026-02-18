/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'rgb(var(--color-navy) / <alpha-value>)',
          light: 'rgb(var(--color-navy-light) / <alpha-value>)',
        },
        ocean: {
          DEFAULT: 'rgb(var(--color-ocean) / <alpha-value>)',
          light: 'rgb(var(--color-ocean-light) / <alpha-value>)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--color-cyan) / <alpha-value>)',
          light: 'rgb(var(--color-cyan-light) / <alpha-value>)',
        },
        coral: {
          DEFAULT: 'rgb(var(--color-coral) / <alpha-value>)',
          light: 'rgb(var(--color-coral-light) / <alpha-value>)',
        },
        surface: {
          page: 'rgb(var(--color-surface-page) / <alpha-value>)',
          card: 'rgb(var(--color-surface-card) / <alpha-value>)',
          dark: 'rgb(var(--color-surface-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif SC', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        heading: ['var(--font-heading)'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
