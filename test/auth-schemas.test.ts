import { describe, it, expect } from 'vitest'

import { loginSchema, registerSchema } from '@/lib/auth/schemas'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const valid = {
    email: 'user@example.com',
    username: 'john_doe',
    password: 'longenough',
  }

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a username shorter than 3 characters', () => {
    expect(
      registerSchema.safeParse({ ...valid, username: 'ab' }).success
    ).toBe(false)
  })

  it('rejects a username longer than 20 characters', () => {
    expect(
      registerSchema.safeParse({ ...valid, username: 'a'.repeat(21) }).success
    ).toBe(false)
  })

  it('rejects a username with spaces or illegal symbols', () => {
    expect(
      registerSchema.safeParse({ ...valid, username: 'john doe' }).success
    ).toBe(false)
    expect(
      registerSchema.safeParse({ ...valid, username: 'john!' }).success
    ).toBe(false)
  })

  it('allows letters, numbers, underscores and hyphens', () => {
    expect(
      registerSchema.safeParse({ ...valid, username: 'a-b_9' }).success
    ).toBe(true)
  })

  it('rejects a password shorter than 8 characters', () => {
    expect(
      registerSchema.safeParse({ ...valid, password: 'short' }).success
    ).toBe(false)
  })
})
