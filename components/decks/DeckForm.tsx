'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import type {
  EditedFlashcard,
  GeneratedFlashcard,
} from '@/lib/ai/ai.schemas'

import { SectionDivider } from '@/components/common/SectionDivider'
import { FlashcardEditor } from '@/components/decks/FlashcardEditor'
import { AddFlashcardsActions } from '@/components/decks/AddFlashcardsActions'
import { BackButton } from '@/components/common/BackButton'

interface FlashcardDraft {
  id: string
  dbId?: string
  frontsideText: string
  backsideText: string
  hint: string
  frontsideImage: string | null
  backsideImage: string | null
}

interface InitialDeck {
  id: string
  title: string
  description: string | null
  flashcards: Array<{
    id: string
    frontsideText: string
    backsideText: string
    hint: string | null
    frontsideImage: string | null
    backsideImage: string | null
  }>
}

interface DeckFormProps {
  initialDeck?: InitialDeck
}

function createEmptyFlashcard(): FlashcardDraft {
  return {
    id: crypto.randomUUID(),
    frontsideText: '',
    backsideText: '',
    hint: '',
    frontsideImage: null,
    backsideImage: null,
  }
}

function flashcardsFromInitial(initial: InitialDeck): FlashcardDraft[] {
  return initial.flashcards.map((fc) => ({
    id: fc.id,
    dbId: fc.id,
    frontsideText: fc.frontsideText,
    backsideText: fc.backsideText,
    hint: fc.hint ?? '',
    frontsideImage: fc.frontsideImage,
    backsideImage: fc.backsideImage,
  }))
}

export function DeckForm({ initialDeck }: DeckFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialDeck)

  const [title, setTitle] = useState(initialDeck?.title ?? '')
  const [description, setDescription] = useState(initialDeck?.description ?? '')
  const [flashcards, setFlashcards] = useState<FlashcardDraft[]>(() =>
    initialDeck ? flashcardsFromInitial(initialDeck) : [createEmptyFlashcard()]
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(() => new Set())

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

  const updateFrontsideImage = useCallback(
    (id: string, value: string | null) => {
      setFlashcards((prev) =>
        prev.map((fc) => (fc.id === id ? { ...fc, frontsideImage: value } : fc))
      )
    },
    []
  )

  const updateBacksideImage = useCallback(
    (id: string, value: string | null) => {
      setFlashcards((prev) =>
        prev.map((fc) => (fc.id === id ? { ...fc, backsideImage: value } : fc))
      )
    },
    []
  )

  const generateAI = useCallback(
    async (id: string, instruction: string): Promise<boolean> => {
      const card = flashcards.find((fc) => fc.id === id)
      if (!card) return false

      setGeneratingIds((prev) => {
        const next = new Set(prev)
        next.add(id)
        return next
      })

      try {
        const response = await fetch('/api/ai/flashcard-edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instruction,
            card: {
              frontsideText: card.frontsideText,
              backsideText: card.backsideText,
              hint: card.hint,
            },
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          toast.error(data.error ?? 'Failed to edit flashcard.')
          return false
        }

        const data: { flashcard: EditedFlashcard } = await response.json()

        updateFrontside(id, data.flashcard.frontsideText)
        updateBackside(id, data.flashcard.backsideText)
        updateHint(id, data.flashcard.hint)
        toast.success('Flashcard updated')
        return true
      } catch {
        toast.error(
          'Network error. Please check your connection and try again.'
        )
        return false
      } finally {
        setGeneratingIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    },
    [flashcards, updateFrontside, updateBackside, updateHint]
  )

  const handleGenerateAIBatch = useCallback(
    async (prompt: string): Promise<boolean> => {
      setIsGenerating(true)
      try {
        const response = await fetch('/api/ai/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          toast.error(data.error ?? 'Failed to generate flashcards.')
          return false
        }

        const data: {
          flashcards: GeneratedFlashcard[]
        } = await response.json()

        const generated: FlashcardDraft[] = data.flashcards.map((fc) => ({
          id: crypto.randomUUID(),
          frontsideText: fc.frontsideText,
          backsideText: fc.backsideText,
          hint: fc.hint ?? '',
          frontsideImage: fc.frontsideImageUrl ?? null,
          backsideImage: fc.backsideImageUrl ?? null,
        }))

        setFlashcards((prev) => [...generated, ...prev])
        toast.success('Generated 3 flashcards')
        return true
      } catch {
        toast.error(
          'Network error. Please check your connection and try again.'
        )
        return false
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  const handleSave = useCallback(async () => {
    const filledFlashcards = flashcards.filter(
      (fc) =>
        (fc.frontsideText.trim() || fc.frontsideImage) &&
        (fc.backsideText.trim() || fc.backsideImage)
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
      const payload = {
        title: title.trim(),
        description: description.trim(),
        flashcards: filledFlashcards.map((fc) => ({
          ...(fc.dbId ? { id: fc.dbId } : {}),
          frontsideText: fc.frontsideText.trim(),
          backsideText: fc.backsideText.trim(),
          hint: fc.hint.trim() || undefined,
          frontsideImage: fc.frontsideImage ?? undefined,
          backsideImage: fc.backsideImage ?? undefined,
        })),
      }

      const response = await fetch(
        isEditing ? `/api/decks/${initialDeck!.id}` : '/api/decks',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        toast.error(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      toast.success(`Deck ${isEditing ? 'updated' : 'created'} successfully!`)
      router.back()
      router.refresh()
    } catch {
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [title, description, flashcards, router, isEditing, initialDeck])

  const submitLabel = isSubmitting ? 'Saving...' : 'Save'

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      {/* Sticky header */}
      <header className="bg-surface-primary dark:bg-surface-primary-dark top-header sticky z-10 flex items-center justify-between py-4 md:top-0">
        <BackButton />

        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="rounded-button border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark cursor-pointer border px-5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
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
        isGenerating={isGenerating}
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
            frontsideImage={fc.frontsideImage}
            backsideImage={fc.backsideImage}
            isGenerating={generatingIds.has(fc.id)}
            onFrontsideChange={updateFrontside}
            onBacksideChange={updateBackside}
            onHintChange={updateHint}
            onFrontsideImageChange={updateFrontsideImage}
            onBacksideImageChange={updateBacksideImage}
            onDelete={deleteFlashcard}
            onGenerateAI={generateAI}
          />
        ))}
      </section>
    </div>
  )
}
