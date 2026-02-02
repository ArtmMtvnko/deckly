'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layers } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface DeckNavItemProps {
  href: string
  label: string
  isExpanded: boolean
  onClick?: () => void
}

export function DeckNavItem({
  href,
  label,
  isExpanded,
  onClick,
}: DeckNavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={twMerge(
        'flex h-10 items-center overflow-hidden rounded-lg transition-all duration-300',
        isActive
          ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Layers className="h-4 w-4" />
      </div>
      <span
        className={twMerge(
          'truncate pr-3 whitespace-nowrap transition-all duration-300',
          isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
        )}
      >
        {label}
      </span>
    </Link>
  )
}
