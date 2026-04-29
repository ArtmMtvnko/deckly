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
  let candidate = base
  let i = 1
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}-${i++}`.slice(0, 20)
  }
  return candidate
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
          image: user.image ?? undefined,
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
        token.username = (user as { name?: string }).name ?? token.username
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
