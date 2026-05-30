import { describe, it, expect, vi } from 'vitest'

// search.service imports the Algolia client (which uses `server-only` and
// requires env vars at import time). buildFilters itself has no dependency on
// it, so we stub the client to keep this a pure, isolated unit test.
vi.mock('@/lib/search/algolia.client', () => ({
  algolia: { searchSingleIndex: vi.fn() },
  PUBLIC_DECKS_INDEX: 'deckly_hub',
  PUBLIC_DECKS_SORT_INDICES: { relevance: 'deckly_hub' },
}))

import { buildFilters } from '@/lib/search/search.service'

describe('buildFilters', () => {
  it('returns undefined when no filters are provided', () => {
    expect(buildFilters({ sortBy: 'relevance', query: '' })).toBeUndefined()
  })

  it('builds a rating filter from minRating', () => {
    expect(
      buildFilters({ sortBy: 'relevance', query: '', minRating: 4 })
    ).toBe('rating >= 4')
  })

  it('ignores a minRating of 0', () => {
    expect(
      buildFilters({ sortBy: 'relevance', query: '', minRating: 0 })
    ).toBeUndefined()
  })

  it('builds a quoted username filter', () => {
    expect(
      buildFilters({ sortBy: 'relevance', query: '', username: 'alice' })
    ).toBe('username:"alice"')
  })

  it('escapes double quotes in the username (injection-safety)', () => {
    expect(
      buildFilters({ sortBy: 'relevance', query: '', username: 'a"b' })
    ).toBe('username:"a\\"b"')
  })

  it('joins multiple filters with AND', () => {
    expect(
      buildFilters({
        sortBy: 'relevance',
        query: '',
        minRating: 3,
        username: 'bob',
      })
    ).toBe('rating >= 3 AND username:"bob"')
  })
})
