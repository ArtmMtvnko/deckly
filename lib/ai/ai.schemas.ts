import { z } from 'zod/v4'

export const flashcardTypeSchema = z.enum([
  'vocabulary',
  'definitions',
  'qa',
  'other',
])

export type FlashcardType = z.infer<typeof flashcardTypeSchema>

export const generatedFlashcardSchema = z.object({
  frontsideText: z.string().min(1),
  backsideText: z.string().min(1),
  hint: z.string().optional(),
  imageSearchQuery: z.string().optional(),
  frontsideImageUrl: z.url().nullish(),
  backsideImageUrl: z.url().nullish(),
})

export const generatedFlashcardsSchema = z.array(generatedFlashcardSchema)

export type GeneratedFlashcard = z.infer<typeof generatedFlashcardSchema>

export const generateFlashcardsRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
})
