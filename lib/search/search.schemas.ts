import { z } from 'zod/v4'

export const searchParamsSchema = z.object({
  query: z.string().max(512).default(''),
  page: z.coerce.number().int().min(0).default(0),
  hitsPerPage: z.coerce.number().int().min(1).max(50).default(12),
})

export type SearchParamsInput = z.infer<typeof searchParamsSchema>
