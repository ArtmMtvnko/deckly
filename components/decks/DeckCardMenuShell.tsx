'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'

interface DeckCardMenuShellProps {
  children: (close: () => void) => ReactNode
}

export function DeckCardMenuShell({ children }: DeckCardMenuShellProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

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

  const close = () => setOpen(false)

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
          {children(close)}
        </div>
      )}
    </div>
  )
}
