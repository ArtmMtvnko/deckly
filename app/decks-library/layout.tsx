import { DeckFilters } from '@/components/decks/DeckFilters'

export default function DecksLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-content-primary dark:text-content-primary-dark text-3xl font-bold">
        Your decks library
      </h1>

      <DeckFilters />

      {children}
    </div>
  )
}
