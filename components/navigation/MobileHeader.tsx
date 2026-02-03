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
    <header className="h-header border-border bg-surface-primary dark:border-border-dark dark:bg-surface-primary-dark fixed top-0 right-0 left-0 z-40 flex items-center border-b px-3">
      <button
        onClick={toggleSidebar}
        className="size-icon-btn rounded-button text-interactive-text hover:bg-interactive-bg-hover hover:text-interactive-text-hover dark:text-interactive-text-dark dark:hover:bg-interactive-bg-hover-dark dark:hover:text-interactive-text-hover-dark flex items-center justify-center transition-colors"
        aria-label="Open menu"
      >
        <Menu className="size-icon" />
      </button>
    </header>
  )
}
