'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Sparkles } from 'lucide-react'

import { SectionDivider } from '@/components/common/SectionDivider'
import { FlashcardEditor } from '@/components/decks/FlashcardEditor'

interface FlashcardDraft {
  id: string
  frontsideText: string
  backsideText: string
}

function createEmptyFlashcard(): FlashcardDraft {
  return { id: crypto.randomUUID(), frontsideText: '', backsideText: '' }
}

export function NewDeckForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [flashcards, setFlashcards] = useState<FlashcardDraft[]>([
    createEmptyFlashcard(),
  ])

  const addFlashcard = useCallback(() => {
    setFlashcards((prev) => [...prev, createEmptyFlashcard()])
  }, [])

  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards((prev) => prev.filter((fc) => fc.id !== id))
  }, [])

  const updateFrontside = useCallback((id: string, value: string) => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, frontsideText: value } : fc))
    )
  }, [])

  const updateBackside = useCallback((id: string, value: string) => {
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
      <header className="bg-surface-primary dark:bg-surface-primary-dark top-header sticky z-10 flex items-center justify-between py-4 md:top-0">
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

      <SectionDivider label="Flashcards" />

      {/* Flashcard list */}
      <section className="space-y-4">
        {flashcards.map((fc, index) => (
          <FlashcardEditor
            key={fc.id}
            index={index}
            frontsideText={fc.frontsideText}
            backsideText={fc.backsideText}
            onFrontsideChange={(v) => updateFrontside(fc.id, v)}
            onBacksideChange={(v) => updateBackside(fc.id, v)}
            onDelete={() => deleteFlashcard(fc.id)}
            onGenerateAI={() => {
              // TODO: AI generation
            }}
          />
        ))}
      </section>

      {/* Add flashcard buttons */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            // TODO: AI generation
          }}
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark rounded-button flex cursor-pointer items-center gap-2 border px-5 py-2 text-sm font-medium transition-colors"
        >
          <Sparkles className="size-icon" />
          Add with AI
        </button>

        <button
          type="button"
          onClick={addFlashcard}
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark rounded-button flex cursor-pointer items-center gap-2 border px-5 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="size-icon" />
          Add a flashcard
        </button>
      </div>
    </div>
  )
}
