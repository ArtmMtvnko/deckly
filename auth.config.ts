import type { NextAuthConfig } from 'next-auth'

const PUBLIC_PATHS = ['/login', '/register']

export default {
  pages: { signIn: '/login' },
  providers: [], // real providers are in auth.ts (Node runtime)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublic = PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p))
      if (isPublic) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/decks-library/your-decks', nextUrl))
        }
        return true
      }
      if (isLoggedIn) return true
      return false
    },
  },
} satisfies NextAuthConfig
