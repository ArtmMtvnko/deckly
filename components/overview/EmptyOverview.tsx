import Link from 'next/link'

export function EmptyOverview() {
  return (
    <div className="py-12 text-center">
      <p className="text-content-primary dark:text-content-primary-dark text-lg font-medium">
        You don&apos;t have any decks yet
      </p>
      <p className="text-content-secondary dark:text-content-secondary-dark mt-2 text-sm">
        Browse the decks hub to find decks or create your own.
      </p>
      <Link
        href="/decks-library/your-decks"
        className="rounded-button bg-content-primary text-surface-primary dark:bg-content-primary-dark dark:text-surface-primary-dark mt-4 inline-block px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
      >
        Go to library
      </Link>
    </div>
  )
}
