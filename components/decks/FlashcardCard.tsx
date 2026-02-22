'use client'

import { Sparkles, Trash2 } from 'lucide-react'

interface FlashcardCardProps {
  index: number
  frontsideText: string
  backsideText: string
  onFrontsideChange: (value: string) => void
  onBacksideChange: (value: string) => void
  onDelete: () => void
  onGenerateAI: () => void
}

export function FlashcardCard({
  index,
  frontsideText,
  backsideText,
  onFrontsideChange,
  onBacksideChange,
  onDelete,
  onGenerateAI,
}: FlashcardCardProps) {
  return (
    <div className="rounded-button border-border dark:border-border-dark relative border p-4 pt-8">
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          type="button"
          onClick={onGenerateAI}
          className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors"
          aria-label={`Generate AI suggestion for flashcard ${index + 1}`}
        >
          <Sparkles className="size-icon" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors hover:text-red-500 dark:hover:text-red-400"
          aria-label={`Delete flashcard ${index + 1}`}
        >
          <Trash2 className="size-icon" />
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor={`front-${index}`}
            className="text-content-secondary dark:text-content-secondary-dark mb-1 block text-xs font-medium"
          >
            Front
          </label>
          <textarea
            id={`front-${index}`}
            value={frontsideText}
            onChange={(e) => onFrontsideChange(e.target.value)}
            placeholder="Front side text"
            rows={3}
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full resize-none border bg-transparent p-2 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
        </div>

        <div className="border-border dark:border-border-dark self-stretch border-l" />

        <div className="flex-1">
          <label
            htmlFor={`back-${index}`}
            className="text-content-secondary dark:text-content-secondary-dark mb-1 block text-xs font-medium"
          >
            Back
          </label>
          <textarea
            id={`back-${index}`}
            value={backsideText}
            onChange={(e) => onBacksideChange(e.target.value)}
            placeholder="Back side text"
            rows={3}
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full resize-none border bg-transparent p-2 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
        </div>
      </div>
    </div>
  )
}
