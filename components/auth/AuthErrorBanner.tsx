export function AuthErrorBanner({ message }: { message: string }) {
  return (
    <p className="rounded-button border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
      {message}
    </p>
  )
}
