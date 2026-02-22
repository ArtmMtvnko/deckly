import { findDecksByCreatorId } from './deck.repository'

export async function getUserCreatedDecks(userId: string) {
  return findDecksByCreatorId(userId)
}
