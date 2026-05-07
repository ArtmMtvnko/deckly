import { updatePublicDeck } from '@/lib/search'

import {
  createUserDeckAndRecordDownload,
  deleteUserDeckAndSrsStates,
  findCopiedDecksByUserId,
  findUserDeck,
} from './copied-deck.repository'
import { findPublishableDeck } from './public-deck.repository'

type CopyDeckError = 'not-public' | 'is-creator' | 'already-copied'
type UncopyDeckError = 'not-copied'

export async function getUserCopiedDecks(userId: string) {
  return findCopiedDecksByUserId(userId)
}

export async function copyDeck(
  deckId: string,
  userId: string
): Promise<{ ok: true } | { error: CopyDeckError }> {
  const deck = await findPublishableDeck(deckId)
  if (!deck || !deck.publicDeck) return { error: 'not-public' }
  if (deck.creatorId === userId) return { error: 'is-creator' }

  const existing = await findUserDeck(userId, deckId)
  if (existing) return { error: 'already-copied' }

  const { publicDeck, incremented } = await createUserDeckAndRecordDownload(
    userId,
    deckId
  )

  if (incremented) {
    await updatePublicDeck(deckId, { downloads: publicDeck.downloads })
  }

  return { ok: true }
}

export async function uncopyDeck(
  deckId: string,
  userId: string
): Promise<{ ok: true } | { error: UncopyDeckError }> {
  const existing = await findUserDeck(userId, deckId)
  if (!existing) return { error: 'not-copied' }

  await deleteUserDeckAndSrsStates(userId, deckId)

  return { ok: true }
}
