'use client'

import { useEffect } from 'react'

import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'
import { MOBILE_BREAKPOINT } from '@/lib/constants'

interface SidebarProviderProps {
  children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const setExpanded = useSidebarStore((state) => state.setExpanded)
  const setMobile = useMobileStore((state) => state.setMobile)

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      setMobile(isMobile)

      // On mobile, sidebar starts closed. On desktop, it can stay as-is
      if (isMobile) {
        setExpanded(false)
      }
    }

    // Initial check
    checkMobile()

    // Listen for resize events
    const widthMediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`
    )

    const handleChange = (event: MediaQueryListEvent) => {
      const isMobile = event.matches
      setMobile(isMobile)
      if (isMobile) {
        setExpanded(false)
      }
    }

    widthMediaQuery.addEventListener('change', handleChange)

    return () => {
      widthMediaQuery.removeEventListener('change', handleChange)
    }
  }, [setMobile, setExpanded])

  return <>{children}</>
}
