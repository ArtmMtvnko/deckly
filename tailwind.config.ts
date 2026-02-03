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
        // Surface colors
        surface: {
          primary: 'var(--color-white)',
          'primary-dark': 'var(--color-neutral-950)',
        },
        // Border colors
        border: {
          DEFAULT: 'var(--color-neutral-200)',
          dark: 'var(--color-neutral-800)',
        },
        // Interactive element colors
        interactive: {
          // Default state
          bg: 'transparent',
          'bg-hover': 'var(--color-neutral-100)',
          'bg-active': 'var(--color-neutral-200)',
          'bg-hover-dark': 'var(--color-neutral-800)',
          'bg-active-dark': 'var(--color-neutral-800)',
          // Text colors
          text: 'var(--color-neutral-600)',
          'text-hover': 'var(--color-neutral-900)',
          'text-active': 'var(--color-neutral-900)',
          'text-dark': 'var(--color-neutral-400)',
          'text-hover-dark': 'var(--color-neutral-100)',
          'text-active-dark': 'var(--color-neutral-100)',
        },
        // Text colors
        content: {
          primary: 'var(--color-neutral-900)',
          'primary-dark': 'var(--color-neutral-100)',
          secondary: 'var(--color-neutral-600)',
          'secondary-dark': 'var(--color-neutral-400)',
          muted: 'var(--color-neutral-200)',
          'muted-dark': 'var(--color-neutral-800)',
        },
      },
      width: {
        sidebar: '16rem',
        'sidebar-collapsed': '4.125rem',
      },
      height: {
        header: '3.5rem',
      },
      spacing: {
        sidebar: '16rem',
        'sidebar-collapsed': '4.125rem',
        header: '3.5rem',
      },
      // Common icon sizes
      size: {
        'icon-sm': '1rem',
        icon: '1.25rem',
        'icon-lg': '1.5rem',
        'icon-btn': '2.5rem',
      },
      // Common border radius
      borderRadius: {
        button: '0.5rem',
      },
      // Common transitions
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
}

export default config
