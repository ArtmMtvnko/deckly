import 'server-only'
import { algoliasearch } from 'algoliasearch'

const appId = process.env.ALGOLIA_APP_ID
const writeKey = process.env.ALGOLIA_WRITE_API_KEY

if (!appId || !writeKey) {
  throw new Error('Missing ALGOLIA_APP_ID or ALGOLIA_WRITE_API_KEY')
}

export const PUBLIC_DECKS_INDEX = 'deckly_hub'
export const algolia = algoliasearch(appId, writeKey)
