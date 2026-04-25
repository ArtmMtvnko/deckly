'use client'

import { useCallback, useState } from 'react'
import { ArrowUp, Loader2, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { AutoResizeTextarea } from '@/components/common/AutoResizeTextarea'

interface Props {
  onAddFlashcard: () => void
  onGenerateAIBatch: (prompt: string) => Promise<boolean>
  isGenerating: boolean
}

export function AddFlashcardsActions({
  onAddFlashcard,
  onGenerateAIBatch,
  isGenerating,
}: Props) {
  const [isAIMode, setIsAIMode] = useState(false)
  const [prompt, setPrompt] = useState('')

  const exitAIMode = useCallback(() => {
    setPrompt('')
    setIsAIMode(false)
  }, [])

  const handleSend = useCallback(async () => {
    const trimmed = prompt.trim()
    if (!trimmed) {
      toast.error('Please enter a prompt.')
      return
    }
    const ok = await onGenerateAIBatch(trimmed)
    if (ok) exitAIMode()
  }, [prompt, onGenerateAIBatch, exitAIMode])

  if (isAIMode) {
    return (
      <div className="mb-6 space-y-3">
        <AutoResizeTextarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the flashcards to generate..."
          minRows={3}
          maxRows={7}
          autoFocus
          disabled={isGenerating}
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full resize-none border bg-transparent px-4 py-3 text-sm transition-colors outline-none focus:border-neutral-400 disabled:opacity-50 dark:focus:border-neutral-600"
        />

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={exitAIMode}
            disabled={isGenerating}
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark rounded-button flex cursor-pointer items-center gap-2 border px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isGenerating}
            className="rounded-button flex cursor-pointer items-center gap-2 bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {isGenerating ? (
              <>
                Generating...
                <Loader2 className="size-icon animate-spin" />
              </>
            ) : (
              <>
                Generate
                <ArrowUp className="size-icon" />
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 flex justify-center gap-3">
      <button
        type="button"
        onClick={() => setIsAIMode(true)}
        className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark rounded-button flex cursor-pointer items-center gap-2 border px-5 py-2 text-sm font-medium transition-colors"
      >
        <Sparkles className="size-icon" />
        Add with AI
      </button>

      <button
        type="button"
        onClick={onAddFlashcard}
        className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark rounded-button flex cursor-pointer items-center gap-2 border px-5 py-2 text-sm font-medium transition-colors"
      >
        <Plus className="size-icon" />
        Add a flashcard
      </button>
    </div>
  )
}
