'use client'

import Image from 'next/image'
import { memo, useCallback, useState } from 'react'
import { ArrowUp, ImageIcon, Loader2, Sparkles, Trash2, X } from 'lucide-react'

import { UnsplashPicker } from '@/components/decks/UnsplashPicker'

interface FlashcardEditorProps {
  id: string
  index: number
  frontsideText: string
  backsideText: string
  hint: string
  frontsideImage: string | null
  backsideImage: string | null
  isGenerating: boolean
  onFrontsideChange: (id: string, value: string) => void
  onBacksideChange: (id: string, value: string) => void
  onHintChange: (id: string, value: string) => void
  onFrontsideImageChange: (id: string, value: string | null) => void
  onBacksideImageChange: (id: string, value: string | null) => void
  onDelete: (id: string) => void
  onGenerateAI: (id: string, instruction: string) => Promise<boolean>
}

export const FlashcardEditor = memo(function FlashcardEditor({
  id,
  index,
  frontsideText,
  backsideText,
  hint,
  frontsideImage,
  backsideImage,
  isGenerating,
  onFrontsideChange,
  onBacksideChange,
  onHintChange,
  onFrontsideImageChange,
  onBacksideImageChange,
  onDelete,
  onGenerateAI,
}: FlashcardEditorProps) {
  const [isAIMode, setIsAIMode] = useState(false)
  const [prompt, setPrompt] = useState('')

  const exitAIMode = useCallback(() => {
    setPrompt('')
    setIsAIMode(false)
  }, [])

  const handleSend = useCallback(async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isGenerating) return
    const ok = await onGenerateAI(id, trimmed)
    if (ok) exitAIMode()
  }, [prompt, isGenerating, onGenerateAI, id, exitAIMode])

  return (
    <div className="rounded-button border-border dark:border-border-dark relative border p-4">
      {/* Top action row */}
      {isAIMode ? (
        <div className="mb-3 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                exitAIMode()
              }
            }}
            placeholder="Describe how to change this card..."
            autoFocus
            disabled={isGenerating}
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button h-8 w-full flex-1 border bg-transparent px-3 text-sm transition-colors outline-none focus:border-neutral-400 disabled:opacity-50 dark:focus:border-neutral-600"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isGenerating || !prompt.trim()}
            aria-label="Send AI edit"
            className="rounded-button flex h-8 w-8 cursor-pointer items-center justify-center bg-black text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {isGenerating ? (
              <Loader2 className="size-icon animate-spin" />
            ) : (
              <ArrowUp className="size-icon" />
            )}
          </button>
          <button
            type="button"
            onClick={exitAIMode}
            disabled={isGenerating}
            aria-label="Cancel AI edit"
            className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark flex h-8 w-8 cursor-pointer items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-icon" />
          </button>
        </div>
      ) : (
        <div className="mb-3 flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setIsAIMode(true)}
            aria-label="Edit with AI"
            className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors"
          >
            <Sparkles className="size-icon" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label="Delete flashcard"
            className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors hover:text-red-500 dark:hover:text-red-400"
          >
            <Trash2 className="size-icon" />
          </button>
        </div>
      )}

      {/* Front / Back sides */}
      <div className="flex gap-4">
        <SideField
          id={`front-${index}`}
          label="Front"
          sideLabel="front"
          value={frontsideText}
          placeholder="Front side text"
          imageUrl={frontsideImage}
          onChange={(v) => onFrontsideChange(id, v)}
          onImageChange={(v) => onFrontsideImageChange(id, v)}
        />

        <div className="border-border dark:border-border-dark self-stretch border-l" />

        <SideField
          id={`back-${index}`}
          label="Back"
          sideLabel="back"
          value={backsideText}
          placeholder="Back side text"
          imageUrl={backsideImage}
          onChange={(v) => onBacksideChange(id, v)}
          onImageChange={(v) => onBacksideImageChange(id, v)}
        />
      </div>

      {/* Hint */}
      <div className="mt-3">
        <label
          htmlFor={`hint-${index}`}
          className="text-content-secondary dark:text-content-secondary-dark mb-1 block text-xs font-medium"
        >
          Hint (optional)
        </label>
        <input
          id={`hint-${index}`}
          type="text"
          value={hint}
          onChange={(e) => onHintChange(id, e.target.value)}
          placeholder="Add a hint to help recall this card"
          className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full border bg-transparent p-2 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
        />
      </div>
    </div>
  )
})

/* ── Private sub-components ────────────────────────────── */

interface SideFieldProps {
  id: string
  label: string
  sideLabel: string
  value: string
  placeholder: string
  imageUrl: string | null
  onChange: (value: string) => void
  onImageChange: (value: string | null) => void
}

function SideField({
  id,
  label,
  sideLabel,
  value,
  placeholder,
  imageUrl,
  onChange,
  onImageChange,
}: SideFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="text-content-secondary dark:text-content-secondary-dark mb-1 block text-xs font-medium"
      >
        {label}
      </label>

      <ImageSlot
        imageUrl={imageUrl}
        onOpenPicker={() => setIsPickerOpen(true)}
        onClear={() => onImageChange(null)}
      />

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button mt-2 w-full resize-none border bg-transparent p-2 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
      />

      <UnsplashPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={onImageChange}
        sideLabel={sideLabel}
      />
    </div>
  )
}

interface ImageSlotProps {
  imageUrl: string | null
  onOpenPicker: () => void
  onClear: () => void
}

function ImageSlot({ imageUrl, onOpenPicker, onClear }: ImageSlotProps) {
  if (imageUrl) {
    return (
      <div className="rounded-button border-border dark:border-border-dark relative aspect-video w-full overflow-hidden border">
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 350px"
          className="object-cover"
        />
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove image"
          className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
        >
          <X className="size-icon" />
        </button>
        <button
          type="button"
          onClick={onOpenPicker}
          className="absolute inset-0 cursor-pointer"
          aria-label="Change image"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpenPicker}
      className="rounded-button border-border dark:border-border-dark text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-1 border border-dashed transition-colors"
    >
      <ImageIcon className="size-icon" />
      <span className="text-xs">Add image</span>
    </button>
  )
}
