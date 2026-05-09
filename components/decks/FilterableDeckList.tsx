'use client'

import { ReactNode, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'

import { DeckSearchBar } from './DeckSearchBar'
import { DeckCard } from './DeckCard'

export interface FilterableDeckItem {
  id: string
  title: string
  description?: string
  menu: ReactNode
}

interface FilterableDeckListProps {
  items: FilterableDeckItem[]
  showCreateButton?: boolean
  emptyMessage: string
  noMatchesMessage?: string
}

export function FilterableDeckList({
  items,
  showCreateButton = false,
  emptyMessage,
  noMatchesMessage = 'No decks match your search.',
}: FilterableDeckListProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmed = query.trim().toLowerCase()
  const filtered =
    trimmed === ''
      ? items
      : items.filter((item) => item.title.toLowerCase().includes(trimmed))

  const handleReset = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {showCreateButton && (
          <Link
            href="/decks/new"
            className="rounded-button bg-content-primary text-surface-primary dark:bg-content-primary-dark dark:text-surface-primary-dark order-first flex shrink-0 items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800 md:order-3 dark:hover:bg-neutral-200"
          >
            <Plus className="size-icon-sm" />
            Create new deck
          </Link>
        )}

        <div className="flex-1 md:order-1">
          <DeckSearchBar
            value={query}
            onChange={setQuery}
            inputRef={inputRef}
          />
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={query === ''}
          aria-label="Clear search"
          className="rounded-button border-border text-content-secondary hover:bg-interactive-bg-hover dark:border-border-dark dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark flex h-9.5 w-9.5 shrink-0 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
        >
          <X className="size-icon" aria-hidden />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
          {emptyMessage}
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
          {noMatchesMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <DeckCard
              key={item.id}
              id={item.id}
              name={item.title}
              description={item.description}
              menu={item.menu}
            />
          ))}
        </div>
      )}
    </>
  )
}
