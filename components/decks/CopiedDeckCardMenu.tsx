'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface CopiedDeckCardMenuProps {
  deckId: string
}

export function CopiedDeckCardMenu({ deckId }: CopiedDeckCardMenuProps) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  async function handleRemove(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    if (removing) return
    setRemoving(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/copy`, { method: 'DELETE' })
      if (!res.ok) {
        console.error('Failed to remove copied deck', await res.text())
        return
      }
      close()
      router.refresh()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <DeckCardMenuShell>
      {(close) => (
        <button
          type="button"
          role="menuitem"
          onClick={(e) => handleRemove(e, close)}
          disabled={removing}
          className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400"
        >
          <Trash2 className="size-icon-sm" />
          {removing ? 'Removing…' : 'Remove'}
        </button>
      )}
    </DeckCardMenuShell>
  )
}
