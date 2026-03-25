import type {
  findDeckForLearning,
  findDecksByCreatorId,
  findDeckWithFlashcards,
} from './deck.repository'

export type DeckSummary = Awaited<
  ReturnType<typeof findDecksByCreatorId>
>[number]

export type DeckWithFlashcards = NonNullable<
  Awaited<ReturnType<typeof findDeckWithFlashcards>>
>

export type DeckForLearningRaw = NonNullable<
  Awaited<ReturnType<typeof findDeckForLearning>>
>

export interface SrsStateData {
  userId: string
  flashcardId: string
  repetitions: number
  intervalDays: number
  easeFactor: number
  nextReview: Date
  lastReviewed: Date | null
}

export type FlashcardWithSrs = DeckWithFlashcards['flashcards'][number] & {
  srsState: SrsStateData
}
