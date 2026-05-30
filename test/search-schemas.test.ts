import { describe, it, expect } from 'vitest'

import {
  searchParamsSchema,
  sortBySchema,
} from '@/lib/search/search.schemas'

describe('searchParamsSchema', () => {
  it('applies defaults when fields are omitted', () => {
    const result = searchParamsSchema.parse({})
    expect(result).toMatchObject({
      query: '',
      page: 0,
      hitsPerPage: 12,
      sortBy: 'relevance',
    })
  })

  it('coerces numeric strings for page and hitsPerPage', () => {
    const result = searchParamsSchema.parse({ page: '3', hitsPerPage: '20' })
    expect(result.page).toBe(3)
    expect(result.hitsPerPage).toBe(20)
  })

  it('rejects hitsPerPage above the max of 50', () => {
    expect(searchParamsSchema.safeParse({ hitsPerPage: 51 }).success).toBe(false)
  })

  it('rejects hitsPerPage below the min of 1', () => {
    expect(searchParamsSchema.safeParse({ hitsPerPage: 0 }).success).toBe(false)
  })

  it('enforces the minRating range of 0 to 5', () => {
    expect(searchParamsSchema.safeParse({ minRating: 3 }).success).toBe(true)
    expect(searchParamsSchema.safeParse({ minRating: 6 }).success).toBe(false)
  })

  it('trims the username', () => {
    const result = searchParamsSchema.parse({ username: '  alice  ' })
    expect(result.username).toBe('alice')
  })

  it('rejects an unknown sortBy value', () => {
    expect(searchParamsSchema.safeParse({ sortBy: 'nope' }).success).toBe(false)
  })
})

describe('sortBySchema', () => {
  it('accepts all supported sort options', () => {
    for (const option of [
      'relevance',
      'rating',
      'downloads',
      'publishedAt',
      'updatedAt',
    ]) {
      expect(sortBySchema.safeParse(option).success).toBe(true)
    }
  })
})
