'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'

import { FlashcardCard } from '@/components/decks/FlashcardCard'

interface FlashcardDraft {
  id: string
  frontsideText: string
  backsideText: string
}

function createEmptyFlashcard(): FlashcardDraft {
  return { id: crypto.randomUUID(), frontsideText: '', backsideText: '' }
}

export default function NewDeckPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [flashcards, setFlashcards] = useState<FlashcardDraft[]>([
    createEmptyFlashcard(),
  ])

  const handleAddFlashcard = useCallback(() => {
    setFlashcards((prev) => [...prev, createEmptyFlashcard()])
  }, [])

  const handleDeleteFlashcard = useCallback((id: string) => {
    setFlashcards((prev) => prev.filter((fc) => fc.id !== id))
  }, [])

  const handleFrontsideChange = useCallback((id: string, value: string) => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, frontsideText: value } : fc))
    )
  }, [])

  const handleBacksideChange = useCallback((id: string, value: string) => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, backsideText: value } : fc))
    )
  }, [])

  const handleDone = useCallback(() => {
    // TODO: persist to backend
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      {/* Sticky header */}
      <header className="bg-surface-primary dark:bg-surface-primary-dark sticky top-0 z-10 flex items-center justify-between py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-content-primary dark:text-content-primary-dark hover:text-content-secondary dark:hover:text-content-secondary-dark flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-icon" />
          Back
        </button>

        <button
          type="button"
          onClick={handleDone}
          className="rounded-button border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark cursor-pointer border px-5 py-1.5 text-sm font-semibold transition-colors"
        >
          Done
        </button>
      </header>

      {/* Deck details */}
      <section className="mt-4 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Deck name"
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full border bg-transparent px-4 py-3 text-lg font-semibold transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deck description (optional)"
          rows={3}
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full resize-none border bg-transparent px-4 py-3 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
        />
      </section>

      {/* Flashcards divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="border-border dark:border-border-dark flex-1 border-t" />
        <span className="text-content-secondary dark:text-content-secondary-dark text-sm font-medium">
          Flashcards
        </span>
        <div className="border-border dark:border-border-dark flex-1 border-t" />
      </div>

      {/* Flashcard list */}
      <section className="space-y-4">
        {flashcards.map((fc, index) => (
          <FlashcardCard
            key={fc.id}
            index={index}
            frontsideText={fc.frontsideText}
            backsideText={fc.backsideText}
            onFrontsideChange={(v) => handleFrontsideChange(fc.id, v)}
            onBacksideChange={(v) => handleBacksideChange(fc.id, v)}
            onDelete={() => handleDeleteFlashcard(fc.id)}
            onGenerateAI={() => {
              // TODO: AI generation
            }}
          />
        ))}
      </section>

      {/* Add flashcard button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleAddFlashcard}
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark rounded-button flex cursor-pointer items-center gap-2 border px-5 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="size-icon" />
          Add a flashcard
        </button>
      </div>
    </div>
  )
}
