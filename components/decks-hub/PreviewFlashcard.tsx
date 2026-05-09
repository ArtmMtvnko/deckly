import { Lightbulb } from 'lucide-react'
import Image from 'next/image'

interface PreviewFlashcardProps {
  index: number
  frontsideText: string
  backsideText: string
  hint: string | null
  frontsideImage: string | null
  backsideImage: string | null
}

export function PreviewFlashcard({
  index,
  frontsideText,
  backsideText,
  hint,
  frontsideImage,
  backsideImage,
}: PreviewFlashcardProps) {
  return (
    <div className="rounded-button border-border dark:border-border-dark relative border p-4 pt-8">
      <span className="text-content-secondary dark:text-content-secondary-dark absolute top-2 right-3 text-xs font-medium tabular-nums">
        #{index + 1}
      </span>

      <div className="flex gap-4">
        <Side label="Front" text={frontsideText} imageUrl={frontsideImage} />
        <div className="border-border dark:border-border-dark self-stretch border-l" />
        <Side label="Back" text={backsideText} imageUrl={backsideImage} />
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
  imageUrl: string | null
}

function Side({ label, text, imageUrl }: SideProps) {
  return (
    <div className="flex-1">
      <div className="text-content-secondary dark:text-content-secondary-dark mb-1 text-xs font-medium">
        {label}
      </div>
      {imageUrl && (
        <div className="rounded-button relative mb-2 aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 350px"
            className="object-cover"
          />
        </div>
      )}
      <p className="text-content-primary dark:text-content-primary-dark text-sm whitespace-pre-wrap">
        {text}
      </p>
    </div>
  )
}
