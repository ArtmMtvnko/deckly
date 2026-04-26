import { algolia, PUBLIC_DECKS_INDEX } from './algolia.client'
import type { PublicDeckHit, SearchResult } from './search.types'

export async function searchPublicDecks(
  query: string,
  page = 0,
  hitsPerPage = 12
): Promise<SearchResult> {
  const res = await algolia.searchSingleIndex<PublicDeckHit>({
    indexName: PUBLIC_DECKS_INDEX,
    searchParams: { query, page, hitsPerPage },
  })

  return {
    hits: res.hits,
    page: res.page ?? 0,
    nbPages: res.nbPages ?? 0,
    nbHits: res.nbHits ?? 0,
  }
}
