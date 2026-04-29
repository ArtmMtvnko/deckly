import { notFound } from 'next/navigation'

import { DeckForm } from '@/components/decks/DeckForm'
import { requireUserId } from '@/lib/auth/session'
import { getDeckForEditing } from '@/lib/decks'

interface EditDeckPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const userId = await requireUserId()
  const { id } = await params
  const deck = await getDeckForEditing(id, userId)

  if (!deck) notFound()

  return (
    <DeckForm
      initialDeck={{
        id: deck.id,
        title: deck.title,
        description: deck.description,
        flashcards: deck.flashcards.map((fc) => ({
          id: fc.id,
          frontsideText: fc.frontsideText,
          backsideText: fc.backsideText,
          hint: fc.hint,
        })),
      }}
    />
  )
}
