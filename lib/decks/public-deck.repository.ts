import prisma from '@/lib/prisma'

export async function findPublishedDecksByCreatorId(creatorId: string) {
  return prisma.deck.findMany({
    where: { creatorId, publicDeck: { isNot: null } },
    include: { publicDeck: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function findPublishableDeck(deckId: string) {
  return prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      creator: { select: { username: true } },
      publicDeck: true,
    },
  })
}

export async function createPublicDeck(deckId: string) {
  return prisma.publicDeck.create({
    data: { deckId },
  })
}

export async function findPublicDeckById(deckId: string) {
  return prisma.publicDeck.findUnique({ where: { deckId } })
}

export async function findPublicDeckPreview(deckId: string) {
  return prisma.publicDeck.findUnique({
    where: { deckId },
    include: {
      deck: {
        include: {
          creator: { select: { username: true } },
          flashcards: {
            take: 10,
            orderBy: { createdAt: 'asc' },
          },
          _count: { select: { flashcards: true } },
        },
      },
    },
  })
}
