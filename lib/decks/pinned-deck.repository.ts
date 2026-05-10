import prisma from '@/lib/prisma'

export async function findPinnedDecksByUserId(userId: string) {
  return prisma.pinnedDeck.findMany({
    where: { userId },
    orderBy: { pinnedAt: 'desc' },
    include: {
      deck: { select: { id: true, title: true } },
    },
  })
}

export async function findPinnedDeckIdsByUserId(
  userId: string
): Promise<Set<string>> {
  const rows = await prisma.pinnedDeck.findMany({
    where: { userId },
    select: { deckId: true },
  })
  return new Set(rows.map((row) => row.deckId))
}

export async function createPinnedDeck(userId: string, deckId: string) {
  return prisma.pinnedDeck.upsert({
    where: { userId_deckId: { userId, deckId } },
    create: { userId, deckId },
    update: {},
  })
}

export async function deletePinnedDeck(userId: string, deckId: string) {
  return prisma.pinnedDeck.deleteMany({
    where: { userId, deckId },
  })
}
