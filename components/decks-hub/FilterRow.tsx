'use client'

import type { SortBy } from '@/lib/search'

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Top rated' },
  { value: 'downloads', label: 'Most downloaded' },
  { value: 'publishedAt', label: 'Recently published' },
  { value: 'updatedAt', label: 'Recently updated' },
]

const MIN_RATING_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Any rating' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
]

const selectClasses =
  'rounded-button border-border bg-surface-primary text-content-primary focus:ring-content-primary dark:border-border-dark dark:bg-surface-primary-dark dark:text-content-primary-dark dark:focus:ring-content-primary-dark border px-3 py-2 text-sm focus:ring-2 focus:outline-none'

type Props = {
  sortBy: SortBy
  minRating: number
  username: string
  onSortByChange: (value: SortBy) => void
  onMinRatingChange: (value: number) => void
  onUsernameChange: (value: string) => void
  onUsernameSubmit: () => void
  onClear: () => void
}

export function FilterRow({
  sortBy,
  minRating,
  username,
  onSortByChange,
  onMinRatingChange,
  onUsernameChange,
  onUsernameSubmit,
  onClear,
}: Props) {
  return (
    <div className="mt-2 flex w-full max-w-3xl flex-wrap items-center gap-2 self-center">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-content-secondary dark:text-content-secondary-dark">
          Sort by
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortBy)}
          className={selectClasses}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-content-secondary dark:text-content-secondary-dark">
          Rating
        </span>
        <select
          value={minRating}
          onChange={(e) => onMinRatingChange(Number(e.target.value))}
          className={selectClasses}
        >
          {MIN_RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onUsernameSubmit()
          }
        }}
        placeholder="Username"
        className="rounded-button border-border bg-surface-primary text-content-primary placeholder:text-content-secondary focus:ring-content-primary dark:border-border-dark dark:bg-surface-primary-dark dark:text-content-primary-dark dark:placeholder:text-content-secondary-dark dark:focus:ring-content-primary-dark min-w-0 flex-1 border px-3 py-2 text-sm focus:ring-2 focus:outline-none sm:max-w-xs"
      />

      <button
        type="button"
        onClick={onClear}
        className="text-content-secondary hover:text-content-primary dark:text-content-secondary-dark dark:hover:text-content-primary-dark ml-auto text-sm underline-offset-2 transition-colors hover:underline"
      >
        Clear
      </button>
    </div>
  )
}
