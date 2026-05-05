import { DeckCard } from '@/components/decks/DeckCard'
import { PublishedDeckCardMenu } from '@/components/decks/PublishedDeckCardMenu'
import { getUserPublishedDecks } from '@/lib/decks'
import { requireUserId } from '@/lib/auth/session'

export default async function PublishedDecksPage() {
  const userId = await requireUserId()
  const decks = await getUserPublishedDecks(userId)

  if (decks.length === 0) {
    return (
      <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
        You haven&apos;t published any decks yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          id={deck.id}
          name={deck.title}
          description={deck.description ?? undefined}
          menu={<PublishedDeckCardMenu deckId={deck.id} />}
        />
      ))}
    </div>
  )
}
