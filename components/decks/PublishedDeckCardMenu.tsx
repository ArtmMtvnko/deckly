'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Pencil, Pin, PinOff, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'

import { DeckCardMenuShell } from './DeckCardMenuShell'

interface PublishedDeckCardMenuProps {
  deckId: string
  isPinned: boolean
}

type ConfirmAction = 'unpublish' | 'delete'

const CONFIRM_CONFIG: Record<
  ConfirmAction,
  {
    title: string
    description: string
    confirmLabel: string
    busyLabel: string
    variant: 'danger' | 'warning'
  }
> = {
  unpublish: {
    title: 'Unpublish deck',
    description:
      'This removes the deck from the public hub and resets its ratings and downloads. People who already copied it keep their copy. You can republish it later.',
    confirmLabel: 'Unpublish',
    busyLabel: 'Unpublishing…',
    variant: 'warning',
  },
  delete: {
    title: 'Delete deck',
    description:
      "This permanently deletes the deck and removes it from everyone who copied it, including their progress. This can't be undone.",
    confirmLabel: 'Delete',
    busyLabel: 'Deleting…',
    variant: 'danger',
  },
}

export function PublishedDeckCardMenu({
  deckId,
  isPinned,
}: PublishedDeckCardMenuProps) {
  const router = useRouter()
  const [pinning, setPinning] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const [busy, setBusy] = useState(false)

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
    setConfirmAction('unpublish')
  }

  function handleDelete(event: React.MouseEvent, close: () => void) {
    event.preventDefault()
    event.stopPropagation()
    close()
    setConfirmAction('delete')
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

  async function runConfirm() {
    if (busy || !confirmAction) return
    setBusy(true)
    try {
      const res = await fetch(
        confirmAction === 'unpublish'
          ? `/api/decks/${deckId}/publish`
          : `/api/decks/${deckId}`,
        { method: 'DELETE' }
      )
      if (!res.ok) {
        console.error(`Failed to ${confirmAction} deck`, await res.text())
        toast.error(`Failed to ${confirmAction} deck`)
        return
      }
      toast.success(
        confirmAction === 'unpublish' ? 'Deck unpublished' : 'Deck deleted'
      )
      setConfirmAction(null)
      router.refresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const config = confirmAction ? CONFIRM_CONFIG[confirmAction] : null

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
      {config && (
        <ConfirmDialog
          isOpen={confirmAction !== null}
          onClose={() => {
            if (!busy) setConfirmAction(null)
          }}
          onConfirm={runConfirm}
          title={config.title}
          description={config.description}
          confirmLabel={busy ? config.busyLabel : config.confirmLabel}
          loading={busy}
          variant={config.variant}
        />
      )}
    </>
  )
}
