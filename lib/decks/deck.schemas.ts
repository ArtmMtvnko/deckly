import { z } from 'zod/v4'

const flashcardBaseSchema = z.object({
  frontsideText: z.string(),
  backsideText: z.string(),
  hint: z.string().max(500).optional(),
  frontsideImage: z.url().optional(),
  backsideImage: z.url().optional(),
})

type FlashcardBase = z.infer<typeof flashcardBaseSchema>

function hasContent(fc: FlashcardBase): boolean {
  return Boolean(
    (fc.frontsideText.trim() || fc.frontsideImage) &&
    (fc.backsideText.trim() || fc.backsideImage)
  )
}

const cardContentMessage = {
  message: 'Each flashcard must have text or an image',
}

const flashcardSchema = flashcardBaseSchema.refine(
  hasContent,
  cardContentMessage
)

export const createDeckSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  flashcards: z
    .array(flashcardSchema)
    .min(1, 'At least one flashcard is required'),
})

export type CreateDeckInput = z.infer<typeof createDeckSchema>

const updateFlashcardSchema = flashcardBaseSchema
  .extend({ id: z.uuid().optional() })
  .refine(hasContent, cardContentMessage)

export const updateDeckSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  flashcards: z
    .array(updateFlashcardSchema)
    .min(1, 'At least one flashcard is required'),
})

export type UpdateDeckInput = z.infer<typeof updateDeckSchema>

export const rateDeckSchema = z.object({
  rating: z.number().int().min(1).max(5),
})

export type RateDeckInput = z.infer<typeof rateDeckSchema>
