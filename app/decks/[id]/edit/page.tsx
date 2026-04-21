interface EditDeckPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const { id } = await params

  return (
    <div className="p-6">
      <h1 className="text-content-primary dark:text-content-primary-dark text-xl font-semibold">
        Edit deck
      </h1>
      <p className="text-content-secondary dark:text-content-secondary-dark mt-2 text-sm">
        Deck editing is coming soon. (ID: {id})
      </p>
    </div>
  )
}
