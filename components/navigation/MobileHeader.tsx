'use client'

import { Menu } from 'lucide-react'
import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'

export function MobileHeader() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
  const isMobile = useMobileStore((state) => state.isMobile)

  if (!isMobile) {
    return null
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center border-b border-neutral-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-950">
      <button
        onClick={toggleSidebar}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  )
}
