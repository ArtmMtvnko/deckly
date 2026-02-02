interface DeckPageProps {
  params: Promise<{ id: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { id } = await params

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Deck {id}
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Study your flashcards from this deck.
      </p>
    </div>
  )
}
