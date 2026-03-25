'use client'

import { Lightbulb } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { BackButton } from '@/components/common/BackButton'
import { SectionDivider } from '@/components/common/SectionDivider'
import type { FlashcardWithSrs } from '@/lib/decks'
import { useMobileStore } from '@/lib/stores/mobileStore'

interface DeckForLearning {
  id: string
  title: string
  description: string | null
  flashcards: FlashcardWithSrs[]
  totalFlashcards: number
  nextReviewAt: string | null
}

function formatTimeUntil(isoDate: string): string {
  const diffMs = new Date(isoDate).getTime() - Date.now()
  const diffMin = Math.max(1, Math.round(diffMs / 60_000))

  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`
  const diffHours = Math.round(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
}

interface FlashcardLearningProps {
  deck: DeckForLearning
}

type AnswerRating = 'again' | 'hard' | 'good' | 'easy'

const ANSWER_BUTTONS: {
  rating: AnswerRating
  label: string
  className: string
}[] = [
  {
    rating: 'again',
    label: 'Again',
    className:
      'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900',
  },
  {
    rating: 'hard',
    label: 'Hard',
    className:
      'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900',
  },
  {
    rating: 'good',
    label: 'Good',
    className:
      'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900',
  },
  {
    rating: 'easy',
    label: 'Easy',
    className:
      'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900',
  },
]

export function FlashcardLearning({ deck }: FlashcardLearningProps) {
  const [queue, setQueue] = useState(() => deck.flashcards.map((_, i) => i))
  const [reviewedCount, setReviewedCount] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const isMobile = useMobileStore((s) => s.isMobile)

  const total = deck.flashcards.length
  const isComplete = queue.length === 0

  async function handleAnswer(rating: AnswerRating) {
    if (isSubmitting || isComplete) return
    const currentCard = deck.flashcards[queue[0]]
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/decks/${deck.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId: currentCard.id, rating }),
      })

      if (!res.ok) {
        toast.error('Failed to save review')
        return
      }

      if (rating === 'again') {
        setQueue((q) => [...q.slice(1), q[0]])
      } else {
        setQueue((q) => q.slice(1))
        setReviewedCount((c) => c + 1)
      }
      setIsFlipped(false)
      setShowHint(false)
    } catch {
      toast.error('Failed to save review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (deck.totalFlashcards === 0) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <h1 className="text-content-primary dark:text-content-primary-dark text-2xl font-bold">
            {deck.title}
          </h1>
          <p className="text-content-secondary dark:text-content-secondary-dark">
            This deck has no flashcards yet.
          </p>
        </div>
      </div>
    )
  }

  if (total === 0 && deck.nextReviewAt) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <h1 className="text-content-primary dark:text-content-primary-dark text-2xl font-bold">
            {deck.title}
          </h1>
          <p className="text-content-secondary dark:text-content-secondary-dark">
            You&apos;re all caught up! Next review in{' '}
            <span className="font-semibold">
              {formatTimeUntil(deck.nextReviewAt)}
            </span>
            .
          </p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <h1 className="text-content-primary dark:text-content-primary-dark text-2xl font-bold">
            Session Complete!
          </h1>
          <p className="text-content-secondary dark:text-content-secondary-dark">
            You reviewed {reviewedCount} flashcard
            {reviewedCount !== 1 && 's'} in{' '}
            <span className="font-semibold">{deck.title}</span>.
          </p>
        </div>
      </div>
    )
  }

  const card = deck.flashcards[queue[0]]

  return (
    <div className="p-6">
      <BackButton />

      <h1 className="text-content-primary dark:text-content-primary-dark mt-6 text-2xl font-bold">
        {deck.title}
      </h1>
      {deck.description && (
        <p className="text-content-secondary dark:text-content-secondary-dark mt-1">
          {deck.description}
        </p>
      )}

      <SectionDivider label={`Flashcard ${reviewedCount + 1} / ${total}`} />

      {/* Flashcard */}
      <div
        className="mx-auto w-full max-w-xl cursor-pointer perspective-[1000px]"
        onClick={() => setIsFlipped((f) => !f)}
      >
        <div
          className={twMerge(
            'relative aspect-3/2 transition-transform duration-500 transform-3d',
            isFlipped &&
              (isMobile
                ? 'transform-[rotateY(180deg)]'
                : 'transform-[rotateX(180deg)]')
          )}
        >
          {/* Front face */}
          <div className="border-border dark:border-border-dark bg-surface-primary dark:bg-surface-primary-dark absolute inset-0 flex flex-col items-center justify-center rounded-2xl border p-6 backface-hidden">
            {card.frontsideImage && (
              <Image
                src={card.frontsideImage}
                alt=""
                width={256}
                height={128}
                unoptimized
                className="mb-4 max-h-32 rounded-lg object-contain"
              />
            )}
            <p className="text-content-primary dark:text-content-primary-dark text-center text-lg font-medium">
              {card.frontsideText}
            </p>

            {card.hint && (
              <div className="absolute right-4 bottom-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowHint((s) => !s)
                  }}
                  className="text-content-secondary dark:text-content-secondary-dark hover:text-content-primary dark:hover:text-content-primary-dark rounded-full p-1.5 transition-colors"
                >
                  <Lightbulb className="size-icon" />
                </button>
                {showHint && (
                  <div
                    className="border-border dark:border-border-dark bg-surface-primary dark:bg-surface-primary-dark absolute right-0 bottom-full mb-2 w-48 rounded-lg border p-3 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
                      {card.hint}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Back face */}
          <div
            className={twMerge(
              'border-border dark:border-border-dark bg-surface-primary dark:bg-surface-primary-dark absolute inset-0 flex flex-col items-center justify-center rounded-2xl border p-6 backface-hidden',
              isMobile
                ? 'transform-[rotateY(180deg)]'
                : 'transform-[rotateX(180deg)]'
            )}
          >
            {card.backsideImage && (
              <Image
                src={card.backsideImage}
                alt=""
                width={256}
                height={128}
                unoptimized
                className="mb-4 max-h-32 rounded-lg object-contain"
              />
            )}
            <p className="text-content-primary dark:text-content-primary-dark text-center text-lg font-medium">
              {card.backsideText}
            </p>
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="mx-auto mt-6 grid max-w-xl grid-cols-4 gap-3">
        {ANSWER_BUTTONS.map((btn) => (
          <button
            key={btn.rating}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAnswer(btn.rating)}
            className={twMerge(
              'rounded-button py-2.5 text-sm font-medium transition-colors disabled:opacity-50',
              btn.className
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
