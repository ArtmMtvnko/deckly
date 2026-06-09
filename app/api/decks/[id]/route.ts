import { NextResponse } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { deleteDeck, updateDeck, updateDeckSchema } from '@/lib/decks'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params
  const body = await request.json()
  const result = updateDeckSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const updated = await updateDeck(id, userId, result.data)
  if (!updated) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
  }

  return NextResponse.json({ id: updated.id })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await requireUserId()
  const { id } = await params

  const deleted = await deleteDeck(id, userId)
  if (!deleted) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
  }

  return NextResponse.json({ id: deleted.id })
}
