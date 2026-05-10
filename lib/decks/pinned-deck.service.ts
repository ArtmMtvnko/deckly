import {
  createPinnedDeck,
  deletePinnedDeck,
  findPinnedDeckIdsByUserId,
  findPinnedDecksByUserId,
} from './pinned-deck.repository'

export async function getPinnedDecksForSidebar(userId: string) {
  const rows = await findPinnedDecksByUserId(userId)
  return rows.map((row) => ({
    id: row.deck.id,
    label: row.deck.title,
    href: `/decks/${row.deck.id}`,
  }))
}

export async function getPinnedDeckIdSet(userId: string): Promise<Set<string>> {
  return findPinnedDeckIdsByUserId(userId)
}

export async function pinDeck(userId: string, deckId: string) {
  await createPinnedDeck(userId, deckId)
  return { ok: true } as const
}

export async function unpinDeck(userId: string, deckId: string) {
  await deletePinnedDeck(userId, deckId)
  return { ok: true } as const
}
