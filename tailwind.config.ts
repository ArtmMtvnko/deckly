import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        sidebar: {
          bg: 'var(--color-white)',
          border: 'var(--color-neutral-200)',
        },
      },
      width: {
        sidebar: '16rem',
        'sidebar-collapsed': '4rem',
      },
      height: {
        header: '3.5rem',
      },
      spacing: {
        sidebar: '16rem',
        'sidebar-collapsed': '4rem',
        header: '3.5rem',
      },
    },
  },
  plugins: [],
}

export default config
