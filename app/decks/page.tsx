import Link from 'next/link'
import { Plus } from 'lucide-react'

import { DeckFilters } from '@/components/decks/DeckFilters'
import { DeckSearchBar } from '@/components/decks/DeckSearchBar'
import { DeckCard } from '@/components/decks/DeckCard'

const MOCK_DECKS = [
  {
    id: '1',
    name: 'Deck 1',
    description:
      'This is the description of the deck. This is the test deck just for the sketch.',
  },
  { id: '2', name: 'Deck 2' },
  { id: '3', name: 'Deck 3' },
]

export default function DecksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-content-primary dark:text-content-primary-dark text-3xl font-bold">
        Your decks library
      </h1>

      <DeckFilters />

      <div className="flex items-center gap-3">
        <DeckSearchBar />
        <Link
          href="/decks/new"
          className="rounded-button bg-content-primary text-surface-primary dark:bg-content-primary-dark dark:text-surface-primary-dark flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <Plus className="size-icon-sm" />
          Create new deck
        </Link>
      </div>

      <div className="space-y-3">
        {MOCK_DECKS.map((deck) => (
          <DeckCard
            key={deck.id}
            id={deck.id}
            name={deck.name}
            description={deck.description}
          />
        ))}
      </div>
    </div>
  )
}
