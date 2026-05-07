import { NextResponse } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { rateDeck, rateDeckSchema, removeRating } from '@/lib/decks'

interface RouteContext {
  params: Promise<{ id: string }>
}

const RATE_ERROR_STATUS = {
  'not-public': 404,
  'is-creator': 400,
  'invalid-rating': 400,
} as const

const REMOVE_ERROR_STATUS = {
  'not-public': 404,
  'is-creator': 400,
  'not-rated': 404,
} as const

export async function POST(request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const body = await request.json().catch(() => null)
  const parsed = rateDeckSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid-rating' }, { status: 400 })
  }

  const result = await rateDeck(id, userId, parsed.data.rating)
  if ('error' in result) {
    return NextResponse.json(
      { error: result.error },
      { status: RATE_ERROR_STATUS[result.error] }
    )
  }

  return NextResponse.json(result)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await removeRating(id, userId)
  if ('error' in result) {
    return NextResponse.json(
      { error: result.error },
      { status: REMOVE_ERROR_STATUS[result.error] }
    )
  }

  return NextResponse.json(result)
}
