export interface PublicDeckHit {
  objectID: string
  deckId: string
  title: string
  description: string
  rating: number
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
