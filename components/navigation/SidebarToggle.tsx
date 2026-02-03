'use client'

import { Menu } from 'lucide-react'
import { useSidebarStore } from '@/lib/stores/sidebarStore'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebarStore()

  return (
    <div className="h-header border-border dark:border-border-dark flex items-center border-b px-3">
      <button
        onClick={toggleSidebar}
        className="size-icon-btn rounded-button text-interactive-text hover:bg-interactive-bg-hover hover:text-interactive-text-hover dark:text-interactive-text-dark dark:hover:bg-interactive-bg-hover-dark dark:hover:text-interactive-text-hover-dark flex items-center justify-center transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="size-icon" />
      </button>
    </div>
  )
}
