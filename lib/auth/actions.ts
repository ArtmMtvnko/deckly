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
  const inputEmail = formData.get('email')?.toString() ?? ''
  const inputPassword = formData.get('password')?.toString() ?? ''
  const values = { email: inputEmail }

  const parsed = loginSchema.safeParse({
    email: inputEmail,
    password: inputPassword,
  })

  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    }
  }

  const { email, password } = parsed.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/decks-library/your-decks',
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error:
          err.type === 'CredentialsSignin'
            ? 'Invalid email or password'
            : 'Sign-in failed',
        values,
      }
    }
    throw err
  }

  return {}
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const inputEmail = formData.get('email')?.toString() ?? ''
  const inputUsername = formData.get('username')?.toString() ?? ''
  const inputPassword = formData.get('password')?.toString() ?? ''
  const values = { email: inputEmail, username: inputUsername }

  const parsed = registerSchema.safeParse({
    email: inputEmail,
    username: inputUsername,
    password: inputPassword,
  })

  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    }
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
    return { fieldErrors, values }
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
      return {
        error: 'Account created but sign-in failed. Please log in.',
        values,
      }
    }
    throw err
  }

  return {}
}

export async function googleSignInAction(): Promise<void> {
  await signIn('google', { redirectTo: '/decks-library/your-decks' })
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' })
}
