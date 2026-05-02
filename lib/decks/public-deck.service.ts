import { indexPublicDeck } from '@/lib/search'

import {
  createPublicDeck,
  findPublishableDeck,
  findPublishedDecksByCreatorId,
} from './public-deck.repository'

export async function getUserPublishedDecks(userId: string) {
  return findPublishedDecksByCreatorId(userId)
}

export async function publishDeck(deckId: string, userId: string) {
  const deck = await findPublishableDeck(deckId)
  if (!deck || deck.creatorId !== userId) return null

  if (deck.publicDeck) {
    return { id: deckId, alreadyPublished: true as const }
  }

  const publicDeck = await createPublicDeck(deckId)

  await indexPublicDeck({
    objectID: deckId,
    title: deck.title,
    description: deck.description ?? '',
    rating: publicDeck.rating ?? 0,
    downloads: publicDeck.downloads,
    publishedAt: publicDeck.publishedAt.getTime(),
    updatedAt: publicDeck.updatedAt.getTime(),
    creatorId: deck.creatorId,
    username: deck.creator.username,
  })

  return { id: deckId, alreadyPublished: false as const }
}
