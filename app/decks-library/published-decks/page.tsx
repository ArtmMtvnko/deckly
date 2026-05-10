import { FilterableDeckList } from '@/components/decks/FilterableDeckList'
import { PublishedDeckCardMenu } from '@/components/decks/PublishedDeckCardMenu'
import { getPinnedDeckIdSet, getUserPublishedDecks } from '@/lib/decks'
import { requireUserId } from '@/lib/auth/session'

export default async function PublishedDecksPage() {
  const userId = await requireUserId()
  const [decks, pinnedIds] = await Promise.all([
    getUserPublishedDecks(userId),
    getPinnedDeckIdSet(userId),
  ])

  const items = decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    description: deck.description ?? undefined,
    menu: (
      <PublishedDeckCardMenu
        deckId={deck.id}
        isPinned={pinnedIds.has(deck.id)}
      />
    ),
  }))

  return (
    <FilterableDeckList
      items={items}
      emptyMessage="You haven't published any decks yet."
    />
  )
}
