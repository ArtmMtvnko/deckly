import { notFound } from 'next/navigation'

import { FlashcardLearning } from '@/components/decks/FlashcardLearning'
import { requireUserId } from '@/lib/auth/session'
import { getDeckForLearning } from '@/lib/decks'

interface DeckPageProps {
  params: Promise<{ id: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
  const userId = await requireUserId()
  const { id } = await params
  const deck = await getDeckForLearning(id, userId)

  if (!deck) notFound()

  return <FlashcardLearning deck={deck} />
}
