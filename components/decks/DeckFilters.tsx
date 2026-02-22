'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

const FILTERS = [
  { href: '/decks-library/your-decks', label: 'Your decks' },
  { href: '/decks-library/public-decks', label: 'Public decks' },
  { href: '/decks-library/copied-decks', label: 'Copied decks' },
  { href: '/decks-library/published-decks', label: 'Published decks' },
] as const

export function DeckFilters() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2">
      {FILTERS.map((filter) => {
        const isActive = pathname === filter.href

        return (
          <Link
            key={filter.href}
            href={filter.href}
            className={twMerge(
              'rounded-button border px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-content-primary bg-content-primary text-surface-primary dark:border-content-primary-dark dark:bg-content-primary-dark dark:text-surface-primary-dark'
                : 'border-border text-content-secondary hover:border-content-primary hover:text-content-primary dark:border-border-dark dark:text-content-secondary-dark dark:hover:border-content-primary-dark dark:hover:text-content-primary-dark'
            )}
          >
            {filter.label}
          </Link>
        )
      })}
    </nav>
  )
}
