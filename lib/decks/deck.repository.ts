import prisma from '@/lib/prisma'

export async function findDecksByCreatorId(creatorId: string) {
  return prisma.deck.findMany({
    where: { creatorId },
    orderBy: { updatedAt: 'desc' },
  })
}
