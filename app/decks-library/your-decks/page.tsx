import Link from 'next/link'
import { Plus } from 'lucide-react'

import { DeckSearchBar } from '@/components/decks/DeckSearchBar'
import { DeckCard } from '@/components/decks/DeckCard'
import { getUserCreatedDecks } from '@/lib/decks'
import { TEMP_USER_ID } from '@/lib/constants'

export default async function YourDecksPage() {
  const decks = await getUserCreatedDecks(TEMP_USER_ID)

  return (
    <>
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

      {decks.length === 0 ? (
        <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
          You haven&apos;t created any decks yet.
        </p>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              id={deck.id}
              name={deck.title}
              description={deck.description ?? undefined}
            />
          ))}
        </div>
      )}
    </>
  )
}
