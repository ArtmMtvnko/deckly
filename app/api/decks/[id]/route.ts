import { NextResponse } from 'next/server'

import { TEMP_USER_ID } from '@/lib/constants'
import { updateDeck, updateDeckSchema } from '@/lib/decks'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()
  const result = updateDeckSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const updated = await updateDeck(id, TEMP_USER_ID, result.data)
  if (!updated) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
  }

  return NextResponse.json({ id: updated.id })
}
