import { NextResponse } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { publishDeck, unpublishDeck } from '@/lib/decks'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await publishDeck(id, userId)
  if (!result) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
  }

  return NextResponse.json(result)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await unpublishDeck(id, userId)
  if (!result) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
  }

  return NextResponse.json(result)
}
