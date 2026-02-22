import type { findDecksByCreatorId } from './deck.repository'

export type DeckSummary = Awaited<
  ReturnType<typeof findDecksByCreatorId>
>[number]
