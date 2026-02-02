'use client'

import { twMerge } from 'tailwind-merge'

import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'

interface SidebarWrapperProps {
  children: React.ReactNode
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const isExpanded = useSidebarStore((state) => state.isExpanded)
  const isMobile = useMobileStore((state) => state.isMobile)

  const sidebarWidth = isExpanded ? 'w-64' : 'w-16.5'
  const mobileTransform = isExpanded ? 'translate-x-0' : '-translate-x-full'

  return (
    <aside
      className={twMerge(
        `fixed top-0 left-0 z-50 flex h-full flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-950`,
        isMobile ? `w-full ${mobileTransform}` : sidebarWidth
      )}
    >
      {children}
    </aside>
  )
}
