import prisma from '@/lib/prisma'

export async function findUserDeck(userId: string, deckId: string) {
  return prisma.userDeck.findUnique({
    where: { userId_deckId: { userId, deckId } },
  })
}

export async function findCopiedDecksByUserId(userId: string) {
  return prisma.userDeck.findMany({
    where: { userId },
    orderBy: { addedAt: 'desc' },
    include: {
      deck: {
        select: {
          id: true,
          title: true,
          description: true,
          creatorId: true,
          creator: { select: { username: true } },
        },
      },
    },
  })
}

export async function createUserDeckAndIncrementDownloads(
  userId: string,
  deckId: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.userDeck.create({ data: { userId, deckId } })
    return tx.publicDeck.update({
      where: { deckId },
      data: { downloads: { increment: 1 } },
    })
  })
}

export async function deleteUserDeckAndSrsStates(
  userId: string,
  deckId: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.sRSState.deleteMany({
      where: { userId, flashcard: { deckId } },
    })
    await tx.userDeck.delete({
      where: { userId_deckId: { userId, deckId } },
    })
  })
}
