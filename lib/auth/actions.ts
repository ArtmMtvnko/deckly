'use server'

import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { z } from 'zod'

import { signIn, signOut } from '@/auth'
import prisma from '@/lib/prisma'
import { loginSchema, registerSchema } from '@/lib/auth/schemas'
import type { AuthFormState } from '@/lib/auth/types'

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/decks-library/your-decks',
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error:
          err.type === 'CredentialsSignin'
            ? 'Invalid email or password'
            : 'Sign-in failed',
      }
    }
    throw err
  }

  return undefined
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { email, username, password } = parsed.data

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  })

  if (existing) {
    const fieldErrors: Record<string, string[]> = {}
    if (existing.email === email)
      fieldErrors.email = ['Email already registered']
    if (existing.username === username)
      fieldErrors.username = ['Username taken']
    return { fieldErrors }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, username, passwordHash } })

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/decks-library/your-decks',
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Account created but sign-in failed. Please log in.' }
    }
    throw err
  }

  return undefined
}

export async function googleSignInAction(): Promise<void> {
  await signIn('google', { redirectTo: '/decks-library/your-decks' })
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' })
}
