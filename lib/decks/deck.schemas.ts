import { z } from 'zod/v4'

const flashcardSchema = z.object({
  frontsideText: z.string().min(1, 'Front side text is required'),
  backsideText: z.string().min(1, 'Back side text is required'),
  hint: z.string().max(500).optional(),
})

export const createDeckSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  flashcards: z
    .array(flashcardSchema)
    .min(1, 'At least one flashcard is required'),
})

export type CreateDeckInput = z.infer<typeof createDeckSchema>
