import { Star, Download } from 'lucide-react'

import type { PublicDeckHit } from '@/lib/search'

interface PublicDeckCardProps {
  hit: PublicDeckHit
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export function PublicDeckCard({ hit }: PublicDeckCardProps) {
  return (
    <article className="rounded-button border-border dark:border-border-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark flex flex-col gap-3 border p-4 transition-colors">
      <div className="min-w-0">
        <h3 className="text-content-primary dark:text-content-primary-dark text-lg font-semibold">
          {hit.title}
        </h3>
        {hit.description && (
          <p className="text-content-secondary dark:text-content-secondary-dark mt-1 line-clamp-2 text-sm">
            {hit.description}
          </p>
        )}
      </div>

      <div className="text-content-secondary dark:text-content-secondary-dark mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1">
          <Star className="size-icon-sm" />
          {hit.rating}
        </span>
        <span className="flex items-center gap-1">
          <Download className="size-icon-sm" />
          {hit.downloads}
        </span>
        <span>@{hit.username}</span>
        <span className="ml-auto">
          {dateFormatter.format(new Date(hit.publishedAt))}
        </span>
      </div>
    </article>
  )
}
