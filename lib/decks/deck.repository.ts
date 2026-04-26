import prisma from '@/lib/prisma'
import type { CreateDeckInput, UpdateDeckInput } from './deck.schemas'

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

export async function updateDeckWithFlashcards(
  deckId: string,
  data: UpdateDeckInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.flashcard.findMany({
      where: { deckId },
      select: { id: true },
    })

    const incomingIds = new Set(
      data.flashcards
        .map((fc) => fc.id)
        .filter((id): id is string => Boolean(id))
    )
    const toDelete = existing
      .filter((fc) => !incomingIds.has(fc.id))
      .map((fc) => fc.id)

    await tx.deck.update({
      where: { id: deckId },
      data: { title: data.title, description: data.description },
    })

    if (toDelete.length > 0) {
      await tx.flashcard.deleteMany({ where: { id: { in: toDelete } } })
    }

    for (const fc of data.flashcards) {
      if (fc.id) {
        await tx.flashcard.update({
          where: { id: fc.id },
          data: {
            frontsideText: fc.frontsideText,
            backsideText: fc.backsideText,
            hint: fc.hint ?? null,
          },
        })
      } else {
        await tx.flashcard.create({
          data: {
            deckId,
            frontsideText: fc.frontsideText,
            backsideText: fc.backsideText,
            hint: fc.hint ?? null,
          },
        })
      }
    }

    return { id: deckId }
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
