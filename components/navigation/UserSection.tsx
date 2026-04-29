import { auth } from '@/auth'
import { UserSectionClient } from './UserSectionClient'

export async function UserSection() {
  const session = await auth()
  const username =
    session?.user?.username ?? session?.user?.email ?? 'User'

  return <UserSectionClient username={username} />
}
