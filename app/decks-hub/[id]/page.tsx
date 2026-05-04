import { notFound } from 'next/navigation'

import { PublicDeckPreview } from '@/components/decks-hub/PublicDeckPreview'
import { getPublicDeckPreview } from '@/lib/decks'

interface PublicDeckPreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function PublicDeckPreviewPage({
  params,
}: PublicDeckPreviewPageProps) {
  const { id } = await params
  const publicDeck = await getPublicDeckPreview(id)

  if (!publicDeck) notFound()

  const { deck } = publicDeck

  return (
    <PublicDeckPreview
      title={deck.title}
      description={deck.description}
      username={deck.creator.username}
      rating={publicDeck.rating}
      downloads={publicDeck.downloads}
      publishedAt={publicDeck.publishedAt}
      updatedAt={publicDeck.updatedAt}
      totalFlashcards={deck._count.flashcards}
      flashcards={deck.flashcards.map((fc) => ({
        id: fc.id,
        frontsideText: fc.frontsideText,
        backsideText: fc.backsideText,
        hint: fc.hint,
      }))}
    />
  )
}
