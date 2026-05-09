import { FilterableDeckList } from '@/components/decks/FilterableDeckList'
import { PublishedDeckCardMenu } from '@/components/decks/PublishedDeckCardMenu'
import { getUserPublishedDecks } from '@/lib/decks'
import { requireUserId } from '@/lib/auth/session'

export default async function PublishedDecksPage() {
  const userId = await requireUserId()
  const decks = await getUserPublishedDecks(userId)

  const items = decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    description: deck.description ?? undefined,
    menu: <PublishedDeckCardMenu deckId={deck.id} />,
  }))

  return (
    <FilterableDeckList
      items={items}
      emptyMessage="You haven't published any decks yet."
    />
  )
}
