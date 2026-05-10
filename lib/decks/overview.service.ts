import {
  countOwnedDecks,
  countOwnedFlashcards,
  findOwnedDecks,
  groupReadyCounts,
  groupTomorrowCounts,
} from './overview.repository'

export interface OverviewDeck {
  id: string
  title: string
  description: string | null
  count: number
}

export interface OverviewData {
  totalDecks: number
  totalFlashcards: number
  readyDecks: OverviewDeck[]
  tomorrowDecks: OverviewDeck[]
}

const DAY_MS = 24 * 60 * 60 * 1000

export async function getOverviewData(userId: string): Promise<OverviewData> {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + DAY_MS)

  const [totalDecks, totalFlashcards, ownedDecks] = await Promise.all([
    countOwnedDecks(userId),
    countOwnedFlashcards(userId),
    findOwnedDecks(userId),
  ])

  const deckIds = ownedDecks.map((deck) => deck.id)

  const [readyCounts, tomorrowCounts] = await Promise.all([
    groupReadyCounts(userId, deckIds, now),
    groupTomorrowCounts(userId, deckIds, now, tomorrow),
  ])

  const deckById = new Map(ownedDecks.map((deck) => [deck.id, deck]))

  const readyDecks: OverviewDeck[] = []
  for (const [deckId, count] of readyCounts) {
    const deck = deckById.get(deckId)
    if (deck) readyDecks.push({ ...deck, count })
  }

  const tomorrowDecks: OverviewDeck[] = []
  for (const [deckId, count] of tomorrowCounts) {
    if (readyCounts.has(deckId)) continue
    const deck = deckById.get(deckId)
    if (deck) tomorrowDecks.push({ ...deck, count })
  }

  return { totalDecks, totalFlashcards, readyDecks, tomorrowDecks }
}
