import 'server-only'
import { algoliasearch } from 'algoliasearch'

const appId = process.env.ALGOLIA_APP_ID
const searchKey = process.env.ALGOLIA_SEARCH_API_KEY

if (!appId || !searchKey) {
  throw new Error('Missing ALGOLIA_APP_ID or ALGOLIA_SEARCH_API_KEY')
}

export const algolia = algoliasearch(appId, searchKey)
export const PUBLIC_DECKS_INDEX = 'deckly_hub'
