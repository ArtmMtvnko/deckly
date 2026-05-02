import { updatePublicDeck } from '@/lib/search'
import { calculateSm2 } from '@/lib/srs/sm2'
import { QUALITY_MAP } from '@/lib/srs/srs.types'
import type { AnswerRating } from '@/lib/srs/srs.types'

import { findPublicDeckById } from './public-deck.repository'
import {
  createDeckWithFlashcards,
  findUnpublishedDecksByCreatorId,
  findDeckForLearning,
  findDeckWithFlashcards,
  findNextReviewForDeck,
  findSrsState,
  updateDeckWithFlashcards,
  upsertSrsState,
} from './deck.repository'
import type { CreateDeckInput, UpdateDeckInput } from './deck.schemas'
import type { FlashcardWithSrs } from './deck.types'

export async function getUserUnpublishedDecks(userId: string) {
  return findUnpublishedDecksByCreatorId(userId)
}

export async function createDeck(creatorId: string, input: CreateDeckInput) {
  return createDeckWithFlashcards(creatorId, input)
}

export async function getDeckForEditing(deckId: string, userId: string) {
  const deck = await findDeckWithFlashcards(deckId)
  if (!deck || deck.creatorId !== userId) return null
  return deck
}

export async function updateDeck(
  deckId: string,
  userId: string,
  input: UpdateDeckInput
) {
  const deck = await findDeckWithFlashcards(deckId)
  if (!deck || deck.creatorId !== userId) return null

  const result = await updateDeckWithFlashcards(deckId, input)

  const publicDeck = await findPublicDeckById(deckId)
  if (publicDeck) {
    await updatePublicDeck(deckId, {
      title: input.title,
      description: input.description ?? '',
      updatedAt: Date.now(),
    })
  }

  return result
}

export async function getDeckForLearning(deckId: string, userId: string) {
  const [deck, nextReviewResult] = await Promise.all([
    findDeckForLearning(deckId, userId),
    findNextReviewForDeck(deckId, userId),
  ])

  if (!deck) return null

  const flashcards: FlashcardWithSrs[] = deck.flashcards.map((fc) => ({
    ...fc,
    srsState: fc.srsStates[0] ?? defaultSrs(userId, fc.id),
  }))

  return {
    id: deck.id,
    title: deck.title,
    description: deck.description,
    flashcards,
    totalFlashcards: deck._count.flashcards,
    nextReviewAt: nextReviewResult?.nextReview.toISOString() ?? null,
  }
}

export async function recordReview(
  userId: string,
  flashcardId: string,
  rating: AnswerRating
) {
  const existing = await findSrsState(userId, flashcardId)
  const current = existing ?? {
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
  }

  const quality = QUALITY_MAP[rating]
  const result = calculateSm2(current, quality)

  await upsertSrsState(userId, flashcardId, result)

  return { nextReview: result.nextReview, intervalDays: result.intervalDays }
}

function defaultSrs(userId: string, flashcardId: string) {
  return {
    userId,
    flashcardId,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReview: new Date(),
    lastReviewed: null,
  }
}
