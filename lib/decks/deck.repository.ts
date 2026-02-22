import prisma from '@/lib/prisma'
import type { CreateDeckInput } from './deck.schemas'

export async function findDecksByCreatorId(creatorId: string) {
  return prisma.deck.findMany({
    where: { creatorId },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function createDeckWithFlashcards(
  creatorId: string,
  data: CreateDeckInput
) {
  return prisma.deck.create({
    data: {
      title: data.title,
      description: data.description,
      creatorId,
      flashcards: {
        create: data.flashcards.map((fc) => ({
          frontsideText: fc.frontsideText,
          backsideText: fc.backsideText,
          hint: fc.hint,
        })),
      },
    },
    select: { id: true },
  })
}
