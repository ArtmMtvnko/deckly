'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Modal } from '@/components/common/Modal'

interface UnsplashImage {
  id: string
  thumbUrl: string
  smallUrl: string
  alt: string | null
}

interface UnsplashPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  sideLabel: string
}

type Status = 'idle' | 'loading' | 'loaded' | 'error'

export function UnsplashPicker({
  isOpen,
  onClose,
  onSelect,
  sideLabel,
}: UnsplashPickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnsplashImage[]>([])
  const [status, setStatus] = useState<Status>('idle')

  async function handleSearch() {
    const trimmed = query.trim()
    if (!trimmed) return

    setStatus('loading')
    try {
      const res = await fetch(
        `/api/unsplash/search?q=${encodeURIComponent(trimmed)}`
      )
      if (!res.ok) {
        setStatus('error')
        toast.error('Failed to search Unsplash')
        return
      }
      const data = (await res.json()) as { images: UnsplashImage[] }
      setResults(data.images)
      setStatus('loaded')
    } catch {
      setStatus('error')
      toast.error('Network error while searching Unsplash')
    }
  }

  function handlePick(image: UnsplashImage) {
    onSelect(image.smallUrl)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add image to ${sideLabel} side`}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
          placeholder="Search Unsplash"
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button flex-1 border bg-transparent px-3 py-2 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={status === 'loading' || !query.trim()}
          className="rounded-button border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark flex cursor-pointer items-center gap-1.5 border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search className="size-icon" />
          Search
        </button>
      </div>

      <div className="mt-4 min-h-40">
        {status === 'idle' && (
          <p className="text-content-secondary dark:text-content-secondary-dark text-center text-sm">
            Search Unsplash for an image.
          </p>
        )}

        {status === 'loading' && (
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-interactive-bg-hover dark:bg-interactive-bg-hover-dark h-32 w-48 shrink-0 animate-pulse rounded-lg"
              />
            ))}
          </div>
        )}

        {status === 'loaded' && results.length === 0 && (
          <p className="text-content-secondary dark:text-content-secondary-dark text-center text-sm">
            No images found.
          </p>
        )}

        {status === 'loaded' && results.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {results.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => handlePick(image)}
                className="relative h-32 w-48 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-80"
              >
                <Image
                  src={image.thumbUrl}
                  alt={image.alt ?? ''}
                  fill
                  sizes="192px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </Modal>
  )
}
