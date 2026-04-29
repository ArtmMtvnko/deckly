import type { Adapter, AdapterUser } from 'next-auth/adapters'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import authConfig from './auth.config'

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

async function deriveUniqueUsername(email: string): Promise<string> {
  const base =
    email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 18) || 'user'

  const existingUsers = await prisma.user.findMany({
    where: { username: { startsWith: base } },
    select: { username: true },
  })
  const taken = new Set(existingUsers.map((u) => u.username))

  if (!taken.has(base)) return base

  for (let i = 1; i < 100; i++) {
    const candidate = `${base}-${i}`.slice(0, 20)
    if (!taken.has(candidate)) return candidate
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 8)
    const candidate = `${base}-${suffix}`.slice(0, 20)
    if (!taken.has(candidate)) return candidate
  }

  throw new Error('Could not derive a unique username')
}

const baseAdapter = PrismaAdapter(
  prisma as unknown as Parameters<typeof PrismaAdapter>[0]
)

const adapter: Adapter = {
  ...baseAdapter,
  async createUser(data: AdapterUser) {
    const username = await deriveUniqueUsername(data.email)

    const created = await prisma.user.create({
      data: {
        email: data.email,
        emailVerified: data.emailVerified ?? null,
        image: data.image ?? null,
        username,
      },
    })

    return {
      id: created.id,
      email: created.email,
      emailVerified: created.emailVerified,
      name: created.username,
      image: created.image,
    } satisfies AdapterUser
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.image,
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        const name = (user as { name?: string | null }).name

        if (name) {
          token.username = name
        } else if (user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { username: true },
          })
          token.username = dbUser?.username ?? token.username
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.username =
          (token.username as string) ?? session.user.name ?? ''
      }
      return session
    },
  },
})
