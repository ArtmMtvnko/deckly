'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Pencil, Pin, PinOff, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface UnpublishedDeckCardMenuProps {
  deckId: string
  isPinned: boolean
}

export function UnpublishedDeckCardMenu({
  deckId,
  isPinned,
}: UnpublishedDeckCardMenuProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)
  const [pinning, setPinning] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
        toast.error('Failed to publish deck')
        return
      }
      const data = await res.json().catch(() => ({}))
      if (data.alreadyPublished) {
        toast.info('Deck is already published')
      } else {
        toast.success('Deck published!')
      }
      close()
      router.refresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setPublishing(false)
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

  function handleDelete(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/decks/${deckId}`, { method: 'DELETE' })
      if (!res.ok) {
        console.error('Failed to delete deck', await res.text())
        toast.error('Failed to delete deck')
        return
      }
      toast.success('Deck deleted')
      setConfirmOpen(false)
      router.refresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
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
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          if (!deleting) setConfirmOpen(false)
        }}
        onConfirm={confirmDelete}
        title="Delete deck"
        description="This permanently deletes the deck and all its flashcards. This can't be undone."
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        loading={deleting}
        variant="danger"
      />
    </>
  )
}
