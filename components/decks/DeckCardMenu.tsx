'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface DeckCardMenuProps {
  deckId: string
  deckName: string
  showPublish?: boolean
  variant?: 'created' | 'copied'
}

export function DeckCardMenu({
  deckId,
  showPublish,
  variant = 'created',
}: DeckCardMenuProps) {
  const [open, setOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!open) return

    function handleMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleTriggerClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setOpen((prev) => !prev)
  }

  function handleEdit(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setOpen(false)
    router.push(`/decks/${deckId}/edit`)
  }

  async function handleDelete(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (variant !== 'copied') {
      setOpen(false)
      // TODO: Implement delete for created decks
      return
    }

    if (deleting) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/copy`, { method: 'DELETE' })
      if (!res.ok) {
        console.error('Failed to remove copied deck', await res.text())
        return
      }
      setOpen(false)
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  async function handlePublish(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (publishing) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/publish`, {
        method: 'POST',
      })
      if (!res.ok) {
        console.error('Failed to publish deck', await res.text())
        return
      }
      setOpen(false)
      router.refresh()
    } finally {
      setPublishing(false)
    }
  }

  const isCopied = variant === 'copied'

  return (
    <div ref={rootRef} className="relative ml-4 shrink-0">
      <button
        type="button"
        onClick={handleTriggerClick}
        className="text-content-secondary hover:text-content-primary dark:text-content-secondary-dark dark:hover:text-content-primary-dark cursor-pointer rounded-md p-1.5 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <MoreVertical className="size-icon" />
      </button>

      {open && (
        <div
          role="menu"
          className="rounded-button bg-surface-primary border-border dark:bg-surface-primary-dark dark:border-border-dark absolute top-full right-0 z-10 mt-1 w-40 border py-1 shadow-md"
        >
          {!isCopied && (
            <button
              type="button"
              role="menuitem"
              onClick={handleEdit}
              className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-blue-500 dark:hover:text-blue-400"
            >
              <Pencil className="size-icon-sm" />
              Edit
            </button>
          )}
          {showPublish && !isCopied && (
            <button
              type="button"
              role="menuitem"
              onClick={handlePublish}
              disabled={publishing}
              className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-green-400"
            >
              <Globe className="size-icon-sm" />
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            disabled={deleting}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400"
          >
            <Trash2 className="size-icon-sm" />
            {isCopied && deleting ? 'Removing…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
