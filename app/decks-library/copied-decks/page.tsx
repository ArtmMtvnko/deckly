import { FilterableDeckList } from '@/components/decks/FilterableDeckList'
import { CopiedDeckCardMenu } from '@/components/decks/CopiedDeckCardMenu'
import { requireUserId } from '@/lib/auth/session'
import { getPinnedDeckIdSet, getUserCopiedDecks } from '@/lib/decks'

export default async function CopiedDecksPage() {
  const userId = await requireUserId()
  const [copies, pinnedIds] = await Promise.all([
    getUserCopiedDecks(userId),
    getPinnedDeckIdSet(userId),
  ])

  const items = copies.map(({ deck }) => ({
    id: deck.id,
    title: deck.title,
    description: deck.description ?? undefined,
    menu: (
      <CopiedDeckCardMenu deckId={deck.id} isPinned={pinnedIds.has(deck.id)} />
    ),
  }))

  return (
    <FilterableDeckList
      items={items}
      emptyMessage="You haven't copied any decks yet."
    />
  )
}
