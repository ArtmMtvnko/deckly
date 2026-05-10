import { requireUserId } from '@/lib/auth/session'
import { getOverviewData, type OverviewDeck } from '@/lib/decks'

import { DeckCard } from '@/components/decks/DeckCard'
import { DueCountBadge } from '@/components/overview/DueCountBadge'
import { EmptyOverview } from '@/components/overview/EmptyOverview'
import { StatCard } from '@/components/overview/StatCard'

export default async function OverviewPage() {
  const userId = await requireUserId()
  const { totalDecks, totalFlashcards, readyDecks, tomorrowDecks } =
    await getOverviewData(userId)

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-content-primary dark:text-content-primary-dark text-3xl font-bold">
        Overview
      </h1>

      {totalDecks === 0 ? (
        <EmptyOverview />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard label="Total decks" value={totalDecks} />
            <StatCard label="Total flashcards" value={totalFlashcards} />
          </div>

          <DeckSection
            heading="Ready to review"
            decks={readyDecks}
            tone="ready"
            emptyMessage="Nothing ready right now."
          />

          <DeckSection
            heading="Coming tomorrow"
            decks={tomorrowDecks}
            tone="tomorrow"
            emptyMessage="Nothing scheduled for tomorrow."
          />
        </>
      )}
    </div>
  )
}

interface DeckSectionProps {
  heading: string
  decks: OverviewDeck[]
  tone: 'ready' | 'tomorrow'
  emptyMessage: string
}

function DeckSection({ heading, decks, tone, emptyMessage }: DeckSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-content-primary dark:text-content-primary-dark text-xl font-semibold">
        {heading}
      </h2>
      {decks.length === 0 ? (
        <p className="text-content-secondary dark:text-content-secondary-dark py-4 text-sm">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              id={deck.id}
              name={deck.title}
              description={deck.description ?? undefined}
              menu={<DueCountBadge count={deck.count} tone={tone} />}
            />
          ))}
        </div>
      )}
    </section>
  )
}
