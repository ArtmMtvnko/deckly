'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
  isExpanded: boolean
  onClick?: () => void
}

export function NavItem({
  href,
  label,
  icon: Icon,
  isExpanded,
  onClick,
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
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
        <Icon className="size-icon" />
      </div>
      <span
        className={twMerge(
          'truncate pr-3 whitespace-nowrap transition-all',
          isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
        )}
      >
        {label}
      </span>
    </Link>
  )
}
