'use client'

import { twMerge } from 'tailwind-merge'

import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const isExpanded = useSidebarStore((state) => state.isExpanded)
  const isMobile = useMobileStore((state) => state.isMobile)

  // On mobile, main content takes full width with top padding for header
  // On desktop, main content is offset by sidebar width
  const marginLeft = isMobile
    ? 'ml-0'
    : isExpanded
      ? 'ml-sidebar'
      : 'ml-sidebar-collapsed'
  const paddingTop = isMobile ? 'pt-header' : 'pt-0'

  return (
    <main
      className={twMerge(
        'min-h-screen transition-all duration-300 ease-in-out',
        marginLeft,
        paddingTop
      )}
    >
      {children}
    </main>
  )
}
