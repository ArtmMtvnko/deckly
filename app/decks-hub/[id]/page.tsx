import { notFound } from 'next/navigation'

import { PublicDeckPreview } from '@/components/decks-hub/PublicDeckPreview'
import { requireUserId } from '@/lib/auth/session'
import {
  findUserDeck,
  getPublicDeckPreview,
  getUserRating,
} from '@/lib/decks'

interface PublicDeckPreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function PublicDeckPreviewPage({
  params,
}: PublicDeckPreviewPageProps) {
  const { id } = await params
  const userId = await requireUserId()

  const [publicDeck, userDeck, userRating] = await Promise.all([
    getPublicDeckPreview(id),
    findUserDeck(userId, id),
    getUserRating(id, userId),
  ])

  if (!publicDeck) notFound()

  const { deck } = publicDeck

  return (
    <PublicDeckPreview
      deckId={deck.id}
      title={deck.title}
      description={deck.description}
      username={deck.creator.username}
      rating={publicDeck.rating}
      ratingsCount={publicDeck.ratingsCount}
      userRating={userRating}
      downloads={publicDeck.downloads}
      publishedAt={publicDeck.publishedAt}
      updatedAt={publicDeck.updatedAt}
      totalFlashcards={deck._count.flashcards}
      flashcards={deck.flashcards.map((fc) => ({
        id: fc.id,
        frontsideText: fc.frontsideText,
        backsideText: fc.backsideText,
        hint: fc.hint,
        frontsideImage: fc.frontsideImage,
        backsideImage: fc.backsideImage,
      }))}
      isCreator={userId === deck.creatorId}
      isCopied={userDeck !== null}
    />
  )
}
