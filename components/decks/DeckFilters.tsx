'use client'

import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const FILTERS = [
  { key: 'your', label: 'Your decks' },
  { key: 'public', label: 'Public decks' },
  { key: 'copied', label: 'Copied decks' },
  { key: 'published', label: 'Published decks' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

export function DeckFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('your')

  return (
    <div className="flex gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          onClick={() => setActiveFilter(filter.key)}
          className={twMerge(
            'rounded-button cursor-pointer border px-4 py-2 text-sm font-medium transition-colors',
            activeFilter === filter.key
              ? 'border-content-primary bg-content-primary text-surface-primary dark:border-content-primary-dark dark:bg-content-primary-dark dark:text-surface-primary-dark'
              : 'border-border text-content-secondary hover:border-content-primary hover:text-content-primary dark:border-border-dark dark:text-content-secondary-dark dark:hover:border-content-primary-dark dark:hover:text-content-primary-dark'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
