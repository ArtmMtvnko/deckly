'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

import type { PublicDeckHit, SearchResult, SortBy } from '@/lib/search'

import { FilterRow } from './FilterRow'
import { PublicDeckCard } from './PublicDeckCard'

type Status = 'idle' | 'loading' | 'loaded' | 'error'

const HITS_PER_PAGE = 12

type FetchArgs = {
  q: string
  page: number
  sortBy: SortBy
  minRating: number
  username: string
}

async function fetchPage({
  q,
  page,
  sortBy,
  minRating,
  username,
}: FetchArgs): Promise<SearchResult | null> {
  const params = new URLSearchParams({
    q,
    page: String(page),
    hitsPerPage: String(HITS_PER_PAGE),
    sortBy,
  })
  if (minRating > 0) params.set('minRating', String(minRating))
  if (username) params.set('username', username)
  const res = await fetch(`/api/decks-hub/search?${params.toString()}`)
  if (!res.ok) return null
  return res.json()
}

export function DecksHubSearch() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null)
  const [usernameInput, setUsernameInput] = useState('')
  const [submittedUsername, setSubmittedUsername] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('relevance')
  const [submittedSortBy, setSubmittedSortBy] = useState<SortBy>('relevance')
  const [minRating, setMinRating] = useState(0)
  const [submittedMinRating, setSubmittedMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [hits, setHits] = useState<PublicDeckHit[]>([])
  const [page, setPage] = useState(0)
  const [nbPages, setNbPages] = useState(0)
  const [status, setStatus] = useState<Status>('idle')

  const runSearch = async (args: Omit<FetchArgs, 'page'>) => {
    setStatus('loading')
    setSubmittedQuery(args.q)
    setSubmittedUsername(args.username)
    setSubmittedSortBy(args.sortBy)
    setSubmittedMinRating(args.minRating)
    setPage(0)

    const data = await fetchPage({ ...args, page: 0 })
    if (!data) {
      setStatus('error')
      return
    }
    setHits(data.hits)
    setNbPages(data.nbPages)
    setStatus('loaded')
  }

  const handleSearch = () => {
    runSearch({
      q: query.trim(),
      sortBy,
      minRating,
      username: usernameInput.trim(),
    })
  }

  const handleLoadMore = async () => {
    if (submittedQuery === null) return
    const nextPage = page + 1
    const data = await fetchPage({
      q: submittedQuery,
      page: nextPage,
      sortBy: submittedSortBy,
      minRating: submittedMinRating,
      username: submittedUsername,
    })
    if (!data) return
    setHits((prev) => [...prev, ...data.hits])
    setPage(nextPage)
    setNbPages(data.nbPages)
  }

  const handleSortByChange = (value: SortBy) => {
    setSortBy(value)
  }

  const handleMinRatingChange = (value: number) => {
    setMinRating(value)
  }

  const handleClearFilters = () => {
    setSortBy('relevance')
    setMinRating(0)
    setUsernameInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const isInitial = submittedQuery === null
  const hasActiveFilters =
    sortBy !== 'relevance' || minRating > 0 || submittedUsername !== ''

  return (
    <div
      className={
        isInitial
          ? 'flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center'
          : 'flex flex-col'
      }
    >
      {isInitial && (
        <div className="mb-6 w-full max-w-3xl self-center text-center">
          <h1 className="text-content-primary dark:text-content-primary-dark text-2xl font-bold">
            Decks hub
          </h1>
          <p className="text-content-secondary dark:text-content-secondary-dark mt-2 text-sm">
            Search for published decks by other people and download them to your
            library.
          </p>
        </div>
      )}

      <div className="flex w-full max-w-3xl items-center gap-2 self-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search decks..."
            className="rounded-button border-border bg-surface-primary text-content-primary placeholder:text-content-secondary focus:ring-content-primary dark:border-border-dark dark:bg-surface-primary-dark dark:text-content-primary-dark dark:placeholder:text-content-secondary-dark dark:focus:ring-content-primary-dark w-full border py-2 pr-10 pl-4 text-sm focus:ring-2 focus:outline-none"
          />
          <Search className="size-icon text-content-secondary dark:text-content-secondary-dark absolute top-1/2 right-3 -translate-y-1/2" />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="rounded-button bg-content-primary text-surface-primary dark:bg-content-primary-dark dark:text-surface-primary-dark shrink-0 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          Search
        </button>

        <button
          type="button"
          aria-label="Filters"
          aria-pressed={showFilters}
          onClick={() => setShowFilters((v) => !v)}
          className={
            hasActiveFilters
              ? 'rounded-button border-content-primary bg-content-primary text-surface-primary dark:border-content-primary-dark dark:bg-content-primary-dark dark:text-surface-primary-dark size-icon-btn flex shrink-0 items-center justify-center border transition-colors'
              : 'rounded-button border-border text-content-secondary hover:bg-interactive-bg-hover dark:border-border-dark dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark size-icon-btn flex shrink-0 items-center justify-center border transition-colors'
          }
        >
          <SlidersHorizontal className="size-icon" />
        </button>
      </div>

      {showFilters && (
        <FilterRow
          sortBy={sortBy}
          minRating={minRating}
          username={usernameInput}
          onSortByChange={handleSortByChange}
          onMinRatingChange={handleMinRatingChange}
          onUsernameChange={setUsernameInput}
          onUsernameSubmit={handleSearch}
          onClear={handleClearFilters}
        />
      )}

      {!isInitial && (
        <div className="mt-6">
          {status === 'loading' && (
            <p className="text-content-secondary dark:text-content-secondary-dark text-center text-sm">
              Searching...
            </p>
          )}

          {status === 'error' && (
            <p className="py-8 text-center text-sm text-red-600 dark:text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          {status === 'loaded' && hits.length === 0 && (
            <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
              No decks match your filters.
            </p>
          )}

          {status === 'loaded' && hits.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {hits.map((hit) => (
                  <PublicDeckCard key={hit.objectID} hit={hit} />
                ))}
              </div>

              {page + 1 < nbPages && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="rounded-button border-border text-content-primary hover:bg-interactive-bg-hover dark:border-border-dark dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark border px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
