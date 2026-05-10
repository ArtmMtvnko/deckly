'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Pencil, Pin, PinOff, Trash2 } from 'lucide-react'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface PublishedDeckCardMenuProps {
  deckId: string
  isPinned: boolean
}

export function PublishedDeckCardMenu({
  deckId,
  isPinned,
}: PublishedDeckCardMenuProps) {
  const router = useRouter()
  const [pinning, setPinning] = useState(false)

  function handleEdit(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    router.push(`/decks/${deckId}/edit`)
  }

  function handleUnpublish(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    // TODO: Implement unpublish for published decks
    console.warn('Unpublish not implemented yet')
  }

  async function handlePinToggle(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    if (pinning) return
    setPinning(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/pin`, {
        method: isPinned ? 'DELETE' : 'POST',
      })
      if (!res.ok) {
        console.error('Failed to toggle pin', await res.text())
        return
      }
      close()
      router.refresh()
    } finally {
      setPinning(false)
    }
  }

  function handleDelete(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    // TODO: Implement delete for published decks
  }

  return (
    <DeckCardMenuShell>
      {(close) => (
        <>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => handleEdit(e, close)}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-blue-500 dark:hover:text-blue-400"
          >
            <Pencil className="size-icon-sm" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => handlePinToggle(e, close)}
            disabled={pinning}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-pink-400"
          >
            {isPinned ? (
              <PinOff className="size-icon-sm" />
            ) : (
              <Pin className="size-icon-sm" />
            )}
            {isPinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => handleUnpublish(e, close)}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-amber-600 dark:hover:text-amber-400"
          >
            <Globe className="size-icon-sm" />
            Unpublish
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => handleDelete(e, close)}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-red-500 dark:hover:text-red-400"
          >
            <Trash2 className="size-icon-sm" />
            Delete
          </button>
        </>
      )}
    </DeckCardMenuShell>
  )
}
