import { calculateSm2, QUALITY_MAP } from '@/lib/srs/sm2'
import type { AnswerRating } from '@/lib/srs/sm2'

import {
  createDeckWithFlashcards,
  findDecksByCreatorId,
  findDeckWithFlashcards,
  findSrsStatesForDeck,
  upsertSrsState,
} from './deck.repository'
import type { CreateDeckInput } from './deck.schemas'
import type { FlashcardWithSrs } from './deck.types'

export async function getUserCreatedDecks(userId: string) {
  return findDecksByCreatorId(userId)
}

export async function createDeck(creatorId: string, input: CreateDeckInput) {
  return createDeckWithFlashcards(creatorId, input)
}

export async function getDeckForLearning(deckId: string, userId: string) {
  const deck = await findDeckWithFlashcards(deckId)
  if (!deck) return null

  const srsStates = await findSrsStatesForDeck(
    userId,
    deck.flashcards.map((fc) => fc.id)
  )

  const srsMap = new Map(srsStates.map((s) => [s.flashcardId, s]))

  const allWithSrs: FlashcardWithSrs[] = deck.flashcards.map((fc) => ({
    ...fc,
    srsState: srsMap.get(fc.id) ?? defaultSrs(userId, fc.id),
  }))

  const now = new Date()
  const flashcards = allWithSrs.filter((fc) => fc.srsState.nextReview <= now)

  const nextReviewAt = allWithSrs
    .filter((fc) => fc.srsState.nextReview > now)
    .reduce<Date | null>(
      (earliest, fc) =>
        !earliest || fc.srsState.nextReview < earliest
          ? fc.srsState.nextReview
          : earliest,
      null
    )

  return {
    ...deck,
    flashcards,
    totalFlashcards: deck.flashcards.length,
    nextReviewAt: nextReviewAt?.toISOString() ?? null,
  }
}

export async function recordReview(
  userId: string,
  flashcardId: string,
  rating: AnswerRating
) {
  const [existing] = await findSrsStatesForDeck(userId, [flashcardId])
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
