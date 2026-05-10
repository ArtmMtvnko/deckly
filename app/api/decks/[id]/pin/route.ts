import { NextResponse } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { pinDeck, unpinDeck } from '@/lib/decks'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await pinDeck(userId, id)
  return NextResponse.json(result)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const result = await unpinDeck(userId, id)
  return NextResponse.json(result)
}
