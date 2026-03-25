import { notFound } from 'next/navigation'

import { FlashcardLearning } from '@/components/decks/FlashcardLearning'
import { TEMP_USER_ID } from '@/lib/constants'
import { getDeckForLearning } from '@/lib/decks'

interface DeckPageProps {
  params: Promise<{ id: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { id } = await params
  const deck = await getDeckForLearning(id, TEMP_USER_ID)

  if (!deck) notFound()

  return <FlashcardLearning deck={deck} />
}
