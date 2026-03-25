import { z } from 'zod/v4'

export const recordReviewSchema = z.object({
  flashcardId: z.uuid(),
  rating: z.enum(['again', 'hard', 'good', 'easy']),
})

export type RecordReviewInput = z.infer<typeof recordReviewSchema>
