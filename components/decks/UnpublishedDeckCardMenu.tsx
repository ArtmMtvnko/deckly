'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Pencil, Trash2 } from 'lucide-react'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface UnpublishedDeckCardMenuProps {
  deckId: string
}

export function UnpublishedDeckCardMenu({
  deckId,
}: UnpublishedDeckCardMenuProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)

  function handleEdit(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    router.push(`/decks/${deckId}/edit`)
  }

  async function handlePublish(event: React.MouseEvent, close: () => void) {
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
      close()
      router.refresh()
    } finally {
      setPublishing(false)
    }
  }

  function handleDelete(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    // TODO: Implement delete for created decks
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
            onClick={(e) => handlePublish(e, close)}
            disabled={publishing}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-green-400"
          >
            <Globe className="size-icon-sm" />
            {publishing ? 'Publishing…' : 'Publish'}
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
