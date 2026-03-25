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

export async function findDeckWithFlashcards(deckId: string) {
  return prisma.deck.findUnique({
    where: { id: deckId },
    include: { flashcards: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function findSrsStatesForDeck(
  userId: string,
  flashcardIds: string[]
) {
  return prisma.sRSState.findMany({
    where: { userId, flashcardId: { in: flashcardIds } },
  })
}

export async function upsertSrsState(
  userId: string,
  flashcardId: string,
  data: {
    repetitions: number
    intervalDays: number
    easeFactor: number
    nextReview: Date
  }
) {
  return prisma.sRSState.upsert({
    where: { userId_flashcardId: { userId, flashcardId } },
    create: { userId, flashcardId, ...data, lastReviewed: new Date() },
    update: { ...data, lastReviewed: new Date() },
  })
}
