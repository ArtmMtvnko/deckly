'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { registerAction, googleSignInAction } from '@/lib/auth/actions'
import type { AuthFormState } from '@/lib/auth/types'

import { GoogleIcon } from './GoogleIcon'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-button bg-interactive-bg dark:bg-interactive-bg-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark text-content-primary dark:text-content-primary-dark w-full cursor-pointer px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Creating account...' : 'Create account'}
    </button>
  )
}

function GoogleButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-button border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark hover:bg-interactive-bg-hover dark:hover:bg-interactive-bg-hover-dark flex w-full cursor-pointer items-center justify-center gap-2 border px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    >
      <GoogleIcon className="h-4 w-4" />
      Continue with Google
    </button>
  )
}

export function RegisterForm({ initialError }: { initialError?: string }) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    registerAction,
    initialError ? { error: initialError } : undefined
  )

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-content-primary dark:text-content-primary-dark text-2xl font-semibold">
          Create your account
        </h1>
        <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
          Start building your decks today
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <p className="rounded-button border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {state.error}
          </p>
        )}

        <div className="space-y-1">
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full border bg-transparent px-4 py-3 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
          {state?.fieldErrors?.email?.map((msg) => (
            <p key={msg} className="text-xs text-red-600 dark:text-red-400">
              {msg}
            </p>
          ))}
        </div>

        <div className="space-y-1">
          <input
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
            required
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full border bg-transparent px-4 py-3 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
          {state?.fieldErrors?.username?.map((msg) => (
            <p key={msg} className="text-xs text-red-600 dark:text-red-400">
              {msg}
            </p>
          ))}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            required
            className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full border bg-transparent px-4 py-3 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
          {state?.fieldErrors?.password?.map((msg) => (
            <p key={msg} className="text-xs text-red-600 dark:text-red-400">
              {msg}
            </p>
          ))}
        </div>

        <SubmitButton />
      </form>

      <div className="flex items-center gap-3">
        <div className="border-border dark:border-border-dark h-px flex-1 border-t" />
        <span className="text-content-muted dark:text-content-muted-dark text-xs uppercase">
          or
        </span>
        <div className="border-border dark:border-border-dark h-px flex-1 border-t" />
      </div>

      <form action={googleSignInAction}>
        <GoogleButton />
      </form>

      <p className="text-content-secondary dark:text-content-secondary-dark text-center text-sm">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-content-primary dark:text-content-primary-dark font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
