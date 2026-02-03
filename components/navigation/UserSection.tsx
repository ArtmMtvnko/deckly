'use client'

import { twMerge } from 'tailwind-merge'
import { User, LogOut } from 'lucide-react'

import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'

export function UserSection() {
  const isExpanded = useSidebarStore((state) => state.isExpanded)
  const isMobile = useMobileStore((state) => state.isMobile)

  const isShowingDetails = isExpanded || isMobile

  return (
    <div className="border-border dark:border-border-dark flex items-center overflow-hidden border-t p-3">
      <div className="size-icon-btn bg-content-muted dark:bg-content-muted-dark flex shrink-0 items-center justify-center rounded-full">
        <User className="size-icon text-content-secondary dark:text-content-secondary-dark" />
      </div>
      <span
        className={twMerge(
          'text-content-primary dark:text-content-primary-dark flex-1 truncate text-sm font-medium transition-all',
          isShowingDetails ? 'ml-3 w-auto opacity-100' : 'ml-0 w-0 opacity-0'
        )}
      >
        User 123
      </span>
      <button
        className={twMerge(
          'size-icon-btn rounded-button text-interactive-text hover:bg-interactive-bg-hover hover:text-interactive-text-hover dark:text-interactive-text-dark dark:hover:bg-interactive-bg-hover-dark dark:hover:text-interactive-text-hover-dark flex shrink-0 items-center justify-center transition-all',
          isShowingDetails ? 'w-icon-btn opacity-100' : 'w-0 opacity-0'
        )}
        aria-label="Log out"
      >
        <LogOut className="size-icon" />
      </button>
    </div>
  )
}
