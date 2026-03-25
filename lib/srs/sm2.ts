import type { QualityRating, SRSInput, SRSOutput } from './srs.types'

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
