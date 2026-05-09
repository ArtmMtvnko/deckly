'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-primary dark:bg-surface-primary-dark border-border dark:border-border-dark flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-border dark:border-border-dark flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-content-primary dark:text-content-primary-dark text-base font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors"
          >
            <X className="size-icon" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </div>
    </div>
  )
}
