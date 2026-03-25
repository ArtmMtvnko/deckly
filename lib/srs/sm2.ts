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

export function calculateSm2(
  input: SRSInput,
  quality: QualityRating
): SRSOutput {
  let { repetitions, intervalDays, easeFactor } = input

  if (quality < 3) {
    repetitions = 0
    intervalDays = 1
  } else {
    repetitions += 1
    if (repetitions === 1) {
      intervalDays = 1
    } else if (repetitions === 2) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(intervalDays * easeFactor)
    }
  }

  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + intervalDays)

  return { repetitions, intervalDays, easeFactor, nextReview }
}
