interface StatCardProps {
  label: string
  value: number
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-button border-border dark:border-border-dark border p-4">
      <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
        {label}
      </p>
      <p className="text-content-primary dark:text-content-primary-dark mt-1 text-3xl font-bold">
        {value}
      </p>
    </div>
  )
}
