'use client'

import { useRouter } from 'next/navigation'
import { Globe, Pencil, Trash2 } from 'lucide-react'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface PublishedDeckCardMenuProps {
  deckId: string
}

export function PublishedDeckCardMenu({
  deckId,
}: PublishedDeckCardMenuProps) {
  const router = useRouter()

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
