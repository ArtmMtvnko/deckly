import { z } from 'zod/v4'

export const generatedFlashcardSchema = z.object({
  frontsideText: z.string().min(1),
  backsideText: z.string().min(1),
  hint: z.string().optional(),
})

export const generatedFlashcardsSchema = z.array(generatedFlashcardSchema)

export type GeneratedFlashcard = z.infer<typeof generatedFlashcardSchema>

export const generateFlashcardsRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
})
