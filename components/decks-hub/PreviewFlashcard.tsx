import { Lightbulb } from 'lucide-react'

interface PreviewFlashcardProps {
  index: number
  frontsideText: string
  backsideText: string
  hint: string | null
}

export function PreviewFlashcard({
  index,
  frontsideText,
  backsideText,
  hint,
}: PreviewFlashcardProps) {
  return (
    <div className="rounded-button border-border dark:border-border-dark relative border p-4 pt-8">
      <span className="text-content-secondary dark:text-content-secondary-dark absolute top-2 right-3 text-xs font-medium tabular-nums">
        #{index + 1}
      </span>

      <div className="flex gap-4">
        <Side label="Front" text={frontsideText} />
        <div className="border-border dark:border-border-dark self-stretch border-l" />
        <Side label="Back" text={backsideText} />
      </div>

      {hint && (
        <div className="text-content-secondary dark:text-content-secondary-dark mt-3 flex items-start gap-2 text-sm">
          <Lightbulb className="size-icon mt-0.5 shrink-0" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  )
}

interface SideProps {
  label: string
  text: string
}

function Side({ label, text }: SideProps) {
  return (
    <div className="flex-1">
      <div className="text-content-secondary dark:text-content-secondary-dark mb-1 text-xs font-medium">
        {label}
      </div>
      <p className="text-content-primary dark:text-content-primary-dark text-sm whitespace-pre-wrap">
        {text}
      </p>
    </div>
  )
}
