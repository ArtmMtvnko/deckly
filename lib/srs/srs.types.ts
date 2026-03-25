export type QualityRating = 1 | 2 | 3 | 4 | 5

export type AnswerRating = 'again' | 'hard' | 'good' | 'easy'

export const QUALITY_MAP: Record<AnswerRating, QualityRating> = {
  again: 1,
  hard: 2,
  good: 4,
  easy: 5,
} as const

export interface SRSInput {
  repetitions: number
  intervalDays: number
  easeFactor: number
}

export interface SRSOutput {
  repetitions: number
  intervalDays: number
  easeFactor: number
  nextReview: Date
}
