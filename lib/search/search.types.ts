import type { SortBy } from './search.schemas'

export interface PublicDeckHit {
  objectID: string
  title: string
  description: string
  rating: number
  ratingsCount: number
  downloads: number
  publishedAt: number
  updatedAt: number
  creatorId: string
  username: string
}

export interface SearchResult {
  hits: PublicDeckHit[]
  page: number
  nbPages: number
  nbHits: number
}

export interface SearchPublicDecksParams {
  query: string
  page?: number
  hitsPerPage?: number
  sortBy?: SortBy
  minRating?: number
  username?: string
}
