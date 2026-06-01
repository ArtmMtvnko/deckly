'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, PinOff } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import { useMobileStore } from '@/lib/stores/mobileStore'

interface DeckNavItemProps {
  id: string
  href: string
  label: string
  isExpanded: boolean
  onClick?: () => void
}

export function DeckNavItem({
  id,
  href,
  label,
  isExpanded,
  onClick,
}: DeckNavItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobileStore((state) => state.isMobile)
  const isActive = pathname === href
  const [unpinning, setUnpinning] = useState(false)

  async function handleUnpin(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (unpinning) return
    setUnpinning(true)
    try {
      const res = await fetch(`/api/decks/${id}/pin`, { method: 'DELETE' })
      if (!res.ok) {
        console.error('Failed to unpin deck', await res.text())
        return
      }
      router.refresh()
    } finally {
      setUnpinning(false)
    }
  }

  return (
    <div className="group relative">
      <Link
        href={href}
        onClick={onClick}
        className={twMerge(
          'h-icon-btn rounded-button flex items-center overflow-hidden transition-all',
          isActive
            ? 'bg-interactive-bg-active text-interactive-text-active dark:bg-interactive-bg-active-dark dark:text-interactive-text-active-dark'
            : 'text-interactive-text hover:bg-interactive-bg-hover hover:text-interactive-text-hover dark:text-interactive-text-dark dark:hover:bg-interactive-bg-hover-dark dark:hover:text-interactive-text-hover-dark'
        )}
      >
        <div className="size-icon-btn flex shrink-0 items-center justify-center">
          <Layers className="size-icon-sm" />
        </div>
        <span
          className={twMerge(
            'truncate pr-9 whitespace-nowrap transition-all',
            isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
          )}
        >
          {label}
        </span>
      </Link>

      {isExpanded && (
        <button
          type="button"
          onClick={handleUnpin}
          disabled={unpinning}
          aria-label={`Unpin ${label}`}
          className={twMerge(
            'rounded-button text-interactive-text hover:bg-interactive-bg-active hover:text-interactive-text-active dark:text-interactive-text-dark dark:hover:bg-interactive-bg-active-dark dark:hover:text-interactive-text-active-dark absolute top-1/2 right-1 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center transition-all hover:text-pink-600 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-pink-400',
            isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <PinOff className="size-icon-sm" />
        </button>
      )}
    </div>
  )
}
