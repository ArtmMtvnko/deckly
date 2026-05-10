'use client'

import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'
import { mainNavItems, decksNavItem, type DeckItem } from '@/lib/navigation'
import { NavItem } from '@/components/common/NavItem'
import { DeckNavItem } from '@/components/common/DeckNavItem'

interface SidebarNavProps {
  pinnedDecks: DeckItem[]
}

export function SidebarNav({ pinnedDecks }: SidebarNavProps) {
  const { isExpanded, setExpanded } = useSidebarStore()
  const isMobile = useMobileStore((state) => state.isMobile)

  const isShowingLabels = isExpanded || isMobile

  const handleNavClick = () => {
    if (isMobile) {
      setExpanded(false)
    }
  }

  return (
    <nav className="flex-1 overflow-y-auto p-3">
      {/* Main nav items */}
      <div className="space-y-1">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isExpanded={isShowingLabels}
            onClick={handleNavClick}
          />
        ))}
      </div>

      {/* Decks section */}
      <div className="mt-6">
        <NavItem
          href={decksNavItem.href}
          label={decksNavItem.label}
          icon={decksNavItem.icon}
          isExpanded={isShowingLabels}
          onClick={handleNavClick}
        />

        {/* Pinned decks */}
        {isShowingLabels && pinnedDecks.length > 0 && (
          <div className="mt-1 space-y-1">
            {pinnedDecks.map((deck) => (
              <DeckNavItem
                key={deck.id}
                href={deck.href}
                label={deck.label}
                isExpanded={isShowingLabels}
                onClick={handleNavClick}
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
