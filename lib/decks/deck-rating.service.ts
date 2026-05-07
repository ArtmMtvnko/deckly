import { updatePublicDeck } from '@/lib/search'

import {
  deleteDeckRatingAndRecompute,
  findDeckRating,
  upsertDeckRatingAndRecompute,
} from './deck-rating.repository'
import { findPublishableDeck } from './public-deck.repository'

type RateDeckError = 'not-public' | 'is-creator' | 'invalid-rating'
type RemoveRatingError = 'not-public' | 'is-creator' | 'not-rated'

export async function getUserRating(deckId: string, userId: string) {
  const existing = await findDeckRating(userId, deckId)
  return existing?.rating ?? null
}

export async function rateDeck(
  deckId: string,
  userId: string,
  rating: number
): Promise<
  | { ok: true; rating: number | null; ratingsCount: number }
  | { error: RateDeckError }
> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'invalid-rating' }
  }

  const deck = await findPublishableDeck(deckId)
  if (!deck || !deck.publicDeck) return { error: 'not-public' }
  if (deck.creatorId === userId) return { error: 'is-creator' }

  const publicDeck = await upsertDeckRatingAndRecompute(userId, deckId, rating)

  await updatePublicDeck(deckId, {
    rating: publicDeck.rating,
    ratingsCount: publicDeck.ratingsCount,
  })

  return {
    ok: true,
    rating: publicDeck.rating,
    ratingsCount: publicDeck.ratingsCount,
  }
}

export async function removeRating(
  deckId: string,
  userId: string
): Promise<
  | { ok: true; rating: number | null; ratingsCount: number }
  | { error: RemoveRatingError }
> {
  const deck = await findPublishableDeck(deckId)
  if (!deck || !deck.publicDeck) return { error: 'not-public' }
  if (deck.creatorId === userId) return { error: 'is-creator' }

  const existing = await findDeckRating(userId, deckId)
  if (!existing) return { error: 'not-rated' }

  const publicDeck = await deleteDeckRatingAndRecompute(userId, deckId)

  await updatePublicDeck(deckId, {
    rating: publicDeck.rating,
    ratingsCount: publicDeck.ratingsCount,
  })

  return {
    ok: true,
    rating: publicDeck.rating,
    ratingsCount: publicDeck.ratingsCount,
  }
}
