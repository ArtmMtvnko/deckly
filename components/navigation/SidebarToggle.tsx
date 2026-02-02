'use client'

import { Menu } from 'lucide-react'
import { useSidebarStore } from '@/lib/stores/sidebarStore'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebarStore()

  return (
    <div className="flex h-14 items-center border-b border-neutral-200 px-3 dark:border-neutral-800">
      <button
        onClick={toggleSidebar}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  )
}
