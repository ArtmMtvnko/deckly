'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { SectionDivider } from '@/components/common/SectionDivider'
import { FlashcardEditor } from '@/components/decks/FlashcardEditor'
import { AddFlashcardsActions } from '@/components/decks/AddFlashcardsActions'
import { BackButton } from '@/components/common/BackButton'

interface FlashcardDraft {
  id: string
  frontsideText: string
  backsideText: string
  hint: string
}

function createEmptyFlashcard(): FlashcardDraft {
  return {
    id: crypto.randomUUID(),
    frontsideText: '',
    backsideText: '',
    hint: '',
  }
}

export function NewDeckForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [flashcards, setFlashcards] = useState<FlashcardDraft[]>([
    createEmptyFlashcard(),
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addFlashcard = useCallback(() => {
    setFlashcards((prev) => [createEmptyFlashcard(), ...prev])
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

  const updateHint = useCallback((id: string, value: string) => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, hint: value } : fc))
    )
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateAI = useCallback((_id: string) => {
    // TODO: AI generation
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGenerateAIBatch = useCallback((_prompt: string) => {
    // TODO: AI batch generation
  }, [])

  const handleDone = useCallback(async () => {
    const filledFlashcards = flashcards.filter(
      (fc) => fc.frontsideText.trim() || fc.backsideText.trim()
    )

    if (!title.trim()) {
      toast.error('Deck name is required.')
      return
    }

    if (filledFlashcards.length === 0) {
      toast.error('Add at least one flashcard with content.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          flashcards: filledFlashcards.map((fc) => ({
            frontsideText: fc.frontsideText.trim(),
            backsideText: fc.backsideText.trim(),
            hint: fc.hint.trim() || undefined,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      toast.success('Deck created successfully!')
      router.push('/decks-library/your-decks')
    } catch {
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [title, description, flashcards, router])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      {/* Sticky header */}
      <header className="bg-surface-primary dark:bg-surface-primary-dark top-header sticky z-10 flex items-center justify-between py-4 md:top-0">
        <BackButton />

        <button
          type="button"
          onClick={handleDone}
          disabled={isSubmitting}
          className="rounded-button border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark cursor-pointer border px-5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Done'}
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

      <AddFlashcardsActions
        onAddFlashcard={addFlashcard}
        onGenerateAIBatch={handleGenerateAIBatch}
      />

      {/* Flashcard list */}
      <section className="space-y-4">
        {flashcards.map((fc, index) => (
          <FlashcardEditor
            key={fc.id}
            id={fc.id}
            index={index}
            frontsideText={fc.frontsideText}
            backsideText={fc.backsideText}
            hint={fc.hint}
            onFrontsideChange={updateFrontside}
            onBacksideChange={updateBackside}
            onHintChange={updateHint}
            onDelete={deleteFlashcard}
            onGenerateAI={generateAI}
          />
        ))}
      </section>
    </div>
  )
}
