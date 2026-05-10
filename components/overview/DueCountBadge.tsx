import { twMerge } from 'tailwind-merge'

interface DueCountBadgeProps {
  count: number
  tone: 'ready' | 'tomorrow'
}

export function DueCountBadge({ count, tone }: DueCountBadgeProps) {
  const toneClasses =
    tone === 'ready'
      ? 'bg-content-primary text-surface-primary dark:bg-content-primary-dark dark:text-surface-primary-dark'
      : 'border-border text-content-secondary dark:border-border-dark dark:text-content-secondary-dark border'

  return (
    <span
      className={twMerge(
        'inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium',
        toneClasses
      )}
    >
      {count}
    </span>
  )
}
