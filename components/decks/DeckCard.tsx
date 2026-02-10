import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface DeckCardProps {
  id: string
  name: string
  description?: string
}

export function DeckCard({ id, name, description }: DeckCardProps) {
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
      <button
        type="button"
        className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark ml-4 shrink-0 cursor-pointer p-2 transition-colors hover:text-red-500 dark:hover:text-red-400"
        aria-label={`Delete ${name}`}
      >
        <Trash2 className="size-icon" />
      </button>
    </Link>
  )
}
