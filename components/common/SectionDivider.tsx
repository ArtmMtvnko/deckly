interface SectionDividerProps {
  label: string
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="border-border dark:border-border-dark flex-1 border-t" />
      <span className="text-content-secondary dark:text-content-secondary-dark text-sm font-medium">
        {label}
      </span>
      <div className="border-border dark:border-border-dark flex-1 border-t" />
    </div>
  )
}
