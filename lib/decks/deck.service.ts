import {
  createDeckWithFlashcards,
  findDecksByCreatorId,
} from './deck.repository'
import type { CreateDeckInput } from './deck.schemas'

export async function getUserCreatedDecks(userId: string) {
  return findDecksByCreatorId(userId)
}

export async function createDeck(creatorId: string, input: CreateDeckInput) {
  return createDeckWithFlashcards(creatorId, input)
}
