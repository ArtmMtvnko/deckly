import { FilterableDeckList } from '@/components/decks/FilterableDeckList'
import { UnpublishedDeckCardMenu } from '@/components/decks/UnpublishedDeckCardMenu'
import { getUserUnpublishedDecks } from '@/lib/decks'
import { requireUserId } from '@/lib/auth/session'

export default async function YourDecksPage() {
  const userId = await requireUserId()
  const decks = await getUserUnpublishedDecks(userId)

  const items = decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    description: deck.description ?? undefined,
    menu: <UnpublishedDeckCardMenu deckId={deck.id} />,
  }))

  return (
    <FilterableDeckList
      items={items}
      showCreateButton
      emptyMessage="You haven't created any decks yet."
    />
  )
}
