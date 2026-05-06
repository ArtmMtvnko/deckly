import 'server-only'
import { algoliasearch } from 'algoliasearch'

const appId = process.env.ALGOLIA_APP_ID
const writeKey = process.env.ALGOLIA_WRITE_API_KEY

if (!appId || !writeKey) {
  throw new Error('Missing ALGOLIA_APP_ID or ALGOLIA_WRITE_API_KEY')
}

export const PUBLIC_DECKS_INDEX = 'deckly_hub'

// Replica indices for sorting by different attributes
export const PUBLIC_DECKS_SORT_INDICES = {
  relevance: PUBLIC_DECKS_INDEX,
  rating: 'deckly_hub_rating_desc',
  downloads: 'deckly_hub_downloads_desc',
  publishedAt: 'deckly_hub_publishedAt_desc',
  updatedAt: 'deckly_hub_updatedAt_desc',
} as const

export const algolia = algoliasearch(appId, writeKey)
