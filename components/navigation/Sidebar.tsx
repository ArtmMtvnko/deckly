import { MobileHeader } from './MobileHeader'
import { SidebarWrapper } from './SidebarWrapper'
import { SidebarToggle } from './SidebarToggle'
import { SidebarNav } from './SidebarNav'
import { UserSection } from './UserSection'

export function Sidebar() {
  return (
    <>
      <MobileHeader />
      <SidebarWrapper>
        <SidebarToggle />
        <SidebarNav />
        <UserSection />
      </SidebarWrapper>
    </>
  )
}
