import { Calendar, Download, RefreshCcw, Star, User } from 'lucide-react'

import { BackButton } from '@/components/common/BackButton'
import { SectionDivider } from '@/components/common/SectionDivider'

import { PreviewFlashcard } from './PreviewFlashcard'

interface PublicDeckPreviewProps {
  title: string
  description: string | null
  username: string
  rating: number | null
  downloads: number
  publishedAt: Date
  updatedAt: Date
  totalFlashcards: number
  flashcards: Array<{
    id: string
    frontsideText: string
    backsideText: string
    hint: string | null
  }>
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export function PublicDeckPreview({
  title,
  description,
  username,
  rating,
  downloads,
  publishedAt,
  updatedAt,
  totalFlashcards,
  flashcards,
}: PublicDeckPreviewProps) {
  const sampleCount = flashcards.length
  const hasMore = totalFlashcards > sampleCount

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      <header className="bg-surface-primary dark:bg-surface-primary-dark top-header sticky z-10 flex items-center justify-between py-4 md:top-0">
        <BackButton />
      </header>

      <section className="mt-2 space-y-3">
        <h1 className="text-content-primary dark:text-content-primary-dark text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-content-secondary dark:text-content-secondary-dark text-base leading-relaxed">
            {description}
          </p>
        )}
      </section>

      <section className="mt-5 flex flex-wrap gap-2">
        <Chip icon={<User className="size-icon-sm" />} label={`@${username}`} />
        {rating !== null && (
          <Chip
            icon={<Star className="size-icon-sm" />}
            label={rating.toFixed(1)}
          />
        )}
        <Chip
          icon={<Download className="size-icon-sm" />}
          label={`${downloads} ${downloads === 1 ? 'download' : 'downloads'}`}
        />
        <Chip
          icon={<Calendar className="size-icon-sm" />}
          label={`Published ${dateFormatter.format(publishedAt)}`}
        />
        <Chip
          icon={<RefreshCcw className="size-icon-sm" />}
          label={`Updated ${dateFormatter.format(updatedAt)}`}
        />
      </section>

      <SectionDivider label="Flashcards" />

      {totalFlashcards === 0 ? (
        <p className="text-content-secondary dark:text-content-secondary-dark py-8 text-center text-sm">
          This deck has no flashcards yet.
        </p>
      ) : (
        <>
          {hasMore && (
            <p className="text-content-secondary dark:text-content-secondary-dark mb-4 text-sm">
              Showing {sampleCount} of {totalFlashcards} flashcards
            </p>
          )}
          <div className="space-y-4">
            {flashcards.map((fc, index) => (
              <PreviewFlashcard
                key={fc.id}
                index={index}
                frontsideText={fc.frontsideText}
                backsideText={fc.backsideText}
                hint={fc.hint}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface ChipProps {
  icon: React.ReactNode
  label: string
}

function Chip({ icon, label }: ChipProps) {
  return (
    <span className="rounded-button border-border dark:border-border-dark text-content-secondary dark:text-content-secondary-dark inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-medium">
      {icon}
      {label}
    </span>
  )
}
