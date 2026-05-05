import { NextResponse } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { copyDeck, uncopyDeck } from '@/lib/decks'

interface RouteContext {
  params: Promise<{ id: string }>
}

const COPY_ERROR_STATUS = {
  'not-public': 404,
  'is-creator': 400,
  'already-copied': 409,
} as const

export async function POST(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await copyDeck(id, userId)
  if ('error' in result) {
    return NextResponse.json(
      { error: result.error },
      { status: COPY_ERROR_STATUS[result.error] }
    )
  }

  return NextResponse.json(result)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await uncopyDeck(id, userId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json(result)
}
