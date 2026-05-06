import { z } from 'zod/v4'

export const sortBySchema = z.enum([
  'relevance',
  'rating',
  'downloads',
  'publishedAt',
  'updatedAt',
])

export type SortBy = z.infer<typeof sortBySchema>

export const searchParamsSchema = z.object({
  query: z.string().max(512).default(''),
  page: z.coerce.number().int().min(0).default(0),
  hitsPerPage: z.coerce.number().int().min(1).max(50).default(12),
  sortBy: sortBySchema.default('relevance'),
  minRating: z.coerce.number().min(0).max(5).optional(),
  username: z.string().trim().max(64).optional(),
})

export type SearchParamsInput = z.infer<typeof searchParamsSchema>
