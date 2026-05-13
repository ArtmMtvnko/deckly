import { getPinnedDecksForSidebar } from '@/lib/decks'
import { auth } from '@/auth'
import type { DeckItem } from '@/lib/navigation'

import { MobileHeader } from './MobileHeader'
import { SidebarWrapper } from './SidebarWrapper'
import { SidebarToggle } from './SidebarToggle'
import { SidebarNav } from './SidebarNav'
import { UserSection } from './UserSection'

export async function Sidebar() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

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
