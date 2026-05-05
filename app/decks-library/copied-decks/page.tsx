import { DeckCard } from '@/components/decks/DeckCard'
import { requireUserId } from '@/lib/auth/session'
import { getUserCopiedDecks } from '@/lib/decks'

export default async function CopiedDecksPage() {
  const userId = await requireUserId()
  const copies = await getUserCopiedDecks(userId)

  if (copies.length === 0) {
    return (
      <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
        You haven&apos;t copied any decks yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {copies.map(({ deck }) => (
        <DeckCard
          key={deck.id}
          id={deck.id}
          name={deck.title}
          description={deck.description ?? undefined}
          variant="copied"
        />
      ))}
    </div>
  )
}
