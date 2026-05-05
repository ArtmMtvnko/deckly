import { algolia } from './algolia.client'
import { PUBLIC_DECKS_INDEX } from './algolia.client'
import type { PublicDeckHit } from './search.types'

export async function indexPublicDeck(hit: PublicDeckHit) {
  await algolia.saveObject({
    indexName: PUBLIC_DECKS_INDEX,
    body: hit,
  })
}

export async function updatePublicDeck(
  deckId: string,
  attrs: Partial<{
    title: string
    description: string
    updatedAt: number
    downloads: number
  }>
) {
  await algolia.partialUpdateObject({
    indexName: PUBLIC_DECKS_INDEX,
    objectID: deckId,
    attributesToUpdate: attrs,
  })
}
