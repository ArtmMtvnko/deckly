import { Sparkles, Trash2 } from 'lucide-react'

interface FlashcardEditorProps {
  index: number
  frontsideText: string
  backsideText: string
  onFrontsideChange: (value: string) => void
  onBacksideChange: (value: string) => void
  onDelete: () => void
  onGenerateAI: () => void
}

export function FlashcardEditor({
  index,
  frontsideText,
  backsideText,
  onFrontsideChange,
  onBacksideChange,
  onDelete,
  onGenerateAI,
}: FlashcardEditorProps) {
  const cardNumber = index + 1

  return (
    <div className="rounded-button border-border dark:border-border-dark relative border p-4 pt-8">
      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          type="button"
          onClick={onGenerateAI}
          className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors"
          aria-label={`Generate AI suggestion for flashcard ${cardNumber}`}
        >
          <Sparkles className="size-icon" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-button text-content-secondary hover:bg-interactive-bg-hover dark:text-content-secondary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer p-1.5 transition-colors hover:text-red-500 dark:hover:text-red-400"
          aria-label={`Delete flashcard ${cardNumber}`}
        >
          <Trash2 className="size-icon" />
        </button>
      </div>

      {/* Front / Back sides */}
      <div className="flex gap-4">
        <SideField
          id={`front-${index}`}
          label="Front"
          value={frontsideText}
          placeholder="Front side text"
          onChange={onFrontsideChange}
        />

        <div className="border-border dark:border-border-dark self-stretch border-l" />

        <SideField
          id={`back-${index}`}
          label="Back"
          value={backsideText}
          placeholder="Back side text"
          onChange={onBacksideChange}
        />
      </div>
    </div>
  )
}

/* ── Private sub-component ─────────────────────────────── */

interface SideFieldProps {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}

function SideField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: SideFieldProps) {
  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="text-content-secondary dark:text-content-secondary-dark mb-1 block text-xs font-medium"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full resize-none border bg-transparent p-2 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
      />
    </div>
  )
}
