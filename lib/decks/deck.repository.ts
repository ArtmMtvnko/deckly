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

export async function findDeckForLearning(deckId: string, userId: string) {
  const now = new Date()

  return prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      flashcards: {
        where: {
          OR: [
            { srsStates: { none: { userId } } },
            {
              srsStates: { some: { userId, nextReview: { lte: now } } },
            },
          ],
        },
        orderBy: { createdAt: 'asc' },
        include: { srsStates: { where: { userId } } },
      },
      _count: { select: { flashcards: true } },
    },
  })
}

export async function findNextReviewForDeck(deckId: string, userId: string) {
  const now = new Date()

  return prisma.sRSState.findFirst({
    where: {
      userId,
      flashcard: { deckId },
      nextReview: { gt: now },
    },
    orderBy: { nextReview: 'asc' },
    select: { nextReview: true },
  })
}

export async function findSrsState(userId: string, flashcardId: string) {
  return prisma.sRSState.findUnique({
    where: { userId_flashcardId: { userId, flashcardId } },
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
