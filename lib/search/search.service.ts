import { algolia, PUBLIC_DECKS_SORT_INDICES } from './algolia.client'
import type {
  PublicDeckHit,
  SearchResult,
  SearchPublicDecksParams,
} from './search.types'

export async function searchPublicDecks(
  params: SearchPublicDecksParams
): Promise<SearchResult> {
  const indexName = PUBLIC_DECKS_SORT_INDICES[params.sortBy ?? 'relevance']
  const filters = buildFilters(params)

  const res = await algolia.searchSingleIndex<PublicDeckHit>({
    indexName,
    searchParams: {
      query: params.query,
      page: params.page ?? 0,
      hitsPerPage: params.hitsPerPage ?? 12,
      filters,
    },
  })

  return {
    hits: res.hits,
    page: res.page ?? 0,
    nbPages: res.nbPages ?? 0,
    nbHits: res.nbHits ?? 0,
  }
}

export function buildFilters({
  minRating,
  username,
}: SearchPublicDecksParams): string | undefined {
  const parts: string[] = []
  if (minRating && minRating > 0) parts.push(`rating >= ${minRating}`)
  if (username) parts.push(`username:"${username.replace(/"/g, '\\"')}"`)
  return parts.length ? parts.join(' AND ') : undefined
}
