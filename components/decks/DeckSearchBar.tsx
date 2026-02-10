'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export function DeckSearchBar() {
  const [query, setQuery] = useState('')

  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search decks..."
        className="rounded-button border-border bg-surface-primary text-content-primary placeholder:text-content-secondary focus:ring-content-primary dark:border-border-dark dark:bg-surface-primary-dark dark:text-content-primary-dark dark:placeholder:text-content-secondary-dark dark:focus:ring-content-primary-dark w-full border py-2 pr-10 pl-4 text-sm focus:ring-2 focus:outline-none"
      />
      <Search className="size-icon text-content-secondary dark:text-content-secondary-dark absolute top-1/2 right-3 -translate-y-1/2" />
    </div>
  )
}
