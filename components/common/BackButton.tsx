'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={router.back}
      className="text-content-primary dark:text-content-primary-dark hover:text-content-secondary dark:hover:text-content-secondary-dark flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors"
    >
      <ArrowLeft className="size-icon" />
      Back
    </button>
  )
}
