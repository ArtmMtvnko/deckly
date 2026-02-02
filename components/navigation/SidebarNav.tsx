'use client'

import { useSidebarStore } from '@/lib/stores/sidebarStore'
import { useMobileStore } from '@/lib/stores/mobileStore'
import {
  mainNavItems,
  decksNavItem,
  newDeckItem,
  mockDecks,
} from '@/lib/navigation'
import { NavItem } from '@/components/common/NavItem'
import { DeckNavItem } from '@/components/common/DeckNavItem'

export function SidebarNav() {
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

        {/* Individual decks */}
        {isShowingLabels && (
          <div className="mt-1 space-y-1">
            {mockDecks.map((deck) => (
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

        {/* New deck button */}
        <div className="mt-1">
          <NavItem
            href={newDeckItem.href}
            label={newDeckItem.label}
            icon={newDeckItem.icon}
            isExpanded={isShowingLabels}
            onClick={handleNavClick}
          />
        </div>
      </div>
    </nav>
  )
}
