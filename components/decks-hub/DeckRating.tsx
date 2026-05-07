'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Star, X } from 'lucide-react'

interface DeckRatingProps {
  deckId: string
  averageRating: number
  ratingsCount: number
  userRating: number | null
  isCreator: boolean
}

export function DeckRating({
  deckId,
  averageRating,
  ratingsCount,
  userRating,
  isCreator,
}: DeckRatingProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState<number | null>(null)
  const [pending, setPending] = useState(false)

  const summary =
    ratingsCount === 0
      ? 'No ratings yet'
      : `${averageRating.toFixed(1)} (${ratingsCount} ${
          ratingsCount === 1 ? 'rating' : 'ratings'
        })`

  if (isCreator) {
    return (
      <div className="flex items-center gap-2">
        <ReadOnlyStars value={averageRating} />
        <span className="text-content-secondary dark:text-content-secondary-dark text-sm">
          {summary}
        </span>
      </div>
    )
  }

  const displayValue = hovered ?? userRating ?? 0

  async function submitRating(rating: number) {
    if (pending) return
    setPending(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      })
      if (!res.ok) {
        console.error('Failed to rate deck', await res.text())
        return
      }
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  async function clearRating() {
    if (pending) return
    setPending(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/rating`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        console.error('Failed to clear rating', await res.text())
        return
      }
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = value <= displayValue
          return (
            <button
              key={value}
              type="button"
              onClick={() => submitRating(value)}
              onMouseEnter={() => setHovered(value)}
              disabled={pending}
              aria-label={`Rate ${value} ${value === 1 ? 'star' : 'stars'}`}
              className="rounded p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Star
                className={
                  filled
                    ? 'size-icon-sm fill-amber-400 text-amber-400'
                    : 'size-icon-sm text-content-secondary dark:text-content-secondary-dark'
                }
              />
            </button>
          )
        })}
      </div>

      <span className="text-content-secondary dark:text-content-secondary-dark text-sm">
        {summary}
      </span>

      {userRating !== null && (
        <button
          type="button"
          onClick={clearRating}
          disabled={pending}
          className="text-content-secondary hover:text-content-primary dark:text-content-secondary-dark dark:hover:text-content-primary-dark mt-1 inline-flex items-center gap-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="size-3" />
          Clear my rating
        </button>
      )}
    </div>
  )
}

function ReadOnlyStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => {
        const filled = v <= Math.round(value)
        return (
          <Star
            key={v}
            className={
              filled
                ? 'size-icon-sm fill-amber-400 text-amber-400'
                : 'size-icon-sm text-content-secondary dark:text-content-secondary-dark'
            }
          />
        )
      })}
    </div>
  )
}
