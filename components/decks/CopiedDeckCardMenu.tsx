'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pin, PinOff, Trash2 } from 'lucide-react'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface CopiedDeckCardMenuProps {
  deckId: string
  isPinned: boolean
}

export function CopiedDeckCardMenu({
  deckId,
  isPinned,
}: CopiedDeckCardMenuProps) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)
  const [pinning, setPinning] = useState(false)

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

  return (
    <DeckCardMenuShell>
      {(close) => (
        <>
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
            onClick={(e) => handleRemove(e, close)}
            disabled={removing}
            className="text-content-primary hover:bg-interactive-bg-hover dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400"
          >
            <Trash2 className="size-icon-sm" />
            {removing ? 'Removing…' : 'Remove'}
          </button>
        </>
      )}
    </DeckCardMenuShell>
  )
}
