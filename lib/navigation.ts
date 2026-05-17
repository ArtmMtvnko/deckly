import { LayoutDashboard, Network, Layers, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface DeckItem {
  id: string
  label: string
  href: string
}

export const mainNavItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/overview',
    icon: LayoutDashboard,
  },
  {
    label: 'Decks Hub',
    href: '/decks-hub',
    icon: Network,
  },
]

export const decksNavItem: NavItem = {
  label: 'Decks',
  href: '/decks-library/your-decks',
  icon: Layers,
}
