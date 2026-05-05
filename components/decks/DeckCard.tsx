import Link from 'next/link'

import { DeckCardMenu } from './DeckCardMenu'

interface DeckCardProps {
  id: string
  name: string
  description?: string
  showPublish?: boolean
  variant?: 'created' | 'copied'
}

export function DeckCard({
  id,
  name,
  description,
  showPublish,
  variant = 'created',
}: DeckCardProps) {
  return (
    <Link
      href={`/decks/${id}`}
      className="rounded-button border-border hover:bg-interactive-bg-hover dark:border-border-dark dark:hover:bg-interactive-bg-hover-dark flex items-center justify-between border p-4 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-content-primary dark:text-content-primary-dark text-lg font-semibold">
          {name}
        </h3>
        {description && (
          <p className="text-content-secondary dark:text-content-secondary-dark mt-1 truncate text-sm">
            {description}
          </p>
        )}
      </div>
      <DeckCardMenu
        deckId={id}
        deckName={name}
        showPublish={showPublish}
        variant={variant}
      />
    </Link>
  )
}
