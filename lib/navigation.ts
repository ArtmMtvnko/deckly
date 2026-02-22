import {
  LayoutDashboard,
  Network,
  Layers,
  Plus,
  type LucideIcon,
} from 'lucide-react'

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
  href: '/decks-library',
  icon: Layers,
}

export const newDeckItem: NavItem = {
  label: 'New deck',
  href: '/decks/new',
  icon: Plus,
}

export const mockDecks: DeckItem[] = [
  {
    id: '1',
    label: 'My first deck',
    href: '/decks/1',
  },
  {
    id: '2',
    label: 'English B2-C1',
    href: '/decks/2',
  },
]
