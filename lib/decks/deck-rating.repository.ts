import type { Prisma } from '@/lib/generated/prisma/client'
import prisma from '@/lib/prisma'

export async function findDeckRating(userId: string, deckId: string) {
  return prisma.deckRating.findUnique({
    where: { userId_deckId: { userId, deckId } },
  })
}

export async function upsertDeckRatingAndRecompute(
  userId: string,
  deckId: string,
  rating: number
) {
  return prisma.$transaction(async (tx) => {
    await tx.deckRating.upsert({
      where: { userId_deckId: { userId, deckId } },
      create: { userId, deckId, rating },
      update: { rating },
    })
    return recomputePublicDeckRating(tx, deckId)
  })
}

export async function deleteDeckRatingAndRecompute(
  userId: string,
  deckId: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.deckRating.delete({
      where: { userId_deckId: { userId, deckId } },
    })
    return recomputePublicDeckRating(tx, deckId)
  })
}

async function recomputePublicDeckRating(
  tx: Prisma.TransactionClient,
  deckId: string
) {
  const aggregate = await tx.deckRating.aggregate({
    where: { deckId },
    _avg: { rating: true },
    _count: { _all: true },
  })

  return tx.publicDeck.update({
    where: { deckId },
    data: {
      rating: aggregate._avg.rating,
      ratingsCount: aggregate._count._all,
    },
  })
}
