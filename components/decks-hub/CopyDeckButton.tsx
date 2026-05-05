'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, Check, Copy } from 'lucide-react'

interface CopyDeckButtonProps {
  deckId: string
  isCreator: boolean
  isCopied: boolean
}

export function CopyDeckButton({
  deckId,
  isCreator,
  isCopied,
}: CopyDeckButtonProps) {
  const router = useRouter()
  const [copying, setCopying] = useState(false)

  if (isCreator) {
    return (
      <span className="rounded-button border-border text-content-secondary dark:border-border-dark dark:text-content-secondary-dark inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium">
        <Check className="size-icon-sm" />
        You created this deck
      </span>
    )
  }

  if (isCopied) {
    return (
      <Link
        href="/decks-library/copied-decks"
        className="rounded-button border-border hover:bg-interactive-bg-hover dark:border-border-dark dark:hover:bg-interactive-bg-hover-dark text-content-primary dark:text-content-primary-dark inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors"
      >
        <BookOpen className="size-icon-sm" />
        Open in library
      </Link>
    )
  }

  async function handleCopy() {
    if (copying) return
    setCopying(true)
    try {
      const res = await fetch(`/api/decks/${deckId}/copy`, { method: 'POST' })
      if (!res.ok) {
        console.error('Failed to copy deck', await res.text())
        return
      }
      router.refresh()
    } finally {
      setCopying(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={copying}
      className="rounded-button bg-content-primary text-surface-primary dark:bg-content-primary-dark dark:text-surface-primary-dark inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-neutral-200"
    >
      <Copy className="size-icon-sm" />
      {copying ? 'Copying…' : 'Copy to my library'}
    </button>
  )
}
