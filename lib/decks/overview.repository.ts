import prisma from '@/lib/prisma'

const ownedByUser = (userId: string) => ({
  OR: [{ creatorId: userId }, { users: { some: { userId } } }],
})

export async function countOwnedDecks(userId: string) {
  const [created, copied] = await Promise.all([
    prisma.deck.count({ where: { creatorId: userId } }),
    prisma.userDeck.count({ where: { userId } }),
  ])
  return created + copied
}

export async function countOwnedFlashcards(userId: string) {
  return prisma.flashcard.count({
    where: { deck: ownedByUser(userId) },
  })
}

export async function findOwnedDecks(userId: string) {
  return prisma.deck.findMany({
    where: ownedByUser(userId),
    select: { id: true, title: true, description: true },
  })
}

export async function groupReadyCounts(
  userId: string,
  deckIds: string[],
  now: Date
) {
  if (deckIds.length === 0) return new Map<string, number>()

  const rows = await prisma.flashcard.groupBy({
    by: ['deckId'],
    where: {
      deckId: { in: deckIds },
      OR: [
        { srsStates: { none: { userId } } },
        { srsStates: { some: { userId, nextReview: { lte: now } } } },
      ],
    },
    _count: { _all: true },
  })

  return new Map(rows.map((row) => [row.deckId, row._count._all]))
}

export async function groupTomorrowCounts(
  userId: string,
  deckIds: string[],
  from: Date,
  to: Date
) {
  if (deckIds.length === 0) return new Map<string, number>()

  const rows = await prisma.flashcard.groupBy({
    by: ['deckId'],
    where: {
      deckId: { in: deckIds },
      srsStates: {
        some: { userId, nextReview: { gt: from, lte: to } },
      },
    },
    _count: { _all: true },
  })

  return new Map(rows.map((row) => [row.deckId, row._count._all]))
}
