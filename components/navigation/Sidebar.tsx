import { getPinnedDecksForSidebar } from '@/lib/decks'
import { requireUserId } from '@/lib/auth/session'
import type { DeckItem } from '@/lib/navigation'

import { MobileHeader } from './MobileHeader'
import { SidebarWrapper } from './SidebarWrapper'
import { SidebarToggle } from './SidebarToggle'
import { SidebarNav } from './SidebarNav'
import { UserSection } from './UserSection'

export async function Sidebar() {
  const userId = await requireUserId()
  const pinnedDecks: DeckItem[] = await getPinnedDecksForSidebar(userId)

  return (
    <>
      <MobileHeader />
      <SidebarWrapper>
        <SidebarToggle />
        <SidebarNav pinnedDecks={pinnedDecks} />
        <UserSection />
      </SidebarWrapper>
    </>
  )
}
