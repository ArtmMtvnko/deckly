import { notFound } from 'next/navigation'

import { DeckForm } from '@/components/decks/DeckForm'
import { TEMP_USER_ID } from '@/lib/constants'
import { getDeckForEditing } from '@/lib/decks'

interface EditDeckPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const { id } = await params
  const deck = await getDeckForEditing(id, TEMP_USER_ID)

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
