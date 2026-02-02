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
    <div className="flex items-center overflow-hidden border-t border-neutral-200 p-3 dark:border-neutral-800">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
        <User className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
      </div>
      <span
        className={twMerge(
          'flex-1 truncate text-sm font-medium text-neutral-900 transition-all duration-300 dark:text-neutral-100',
          isShowingDetails ? 'ml-3 w-auto opacity-100' : 'ml-0 w-0 opacity-0'
        )}
      >
        User 123
      </span>
      <button
        className={twMerge(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-all duration-300 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
          isShowingDetails ? 'w-10 opacity-100' : 'w-0 opacity-0'
        )}
        aria-label="Log out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  )
}
