import { NextResponse } from 'next/server'

import { TEMP_USER_ID } from '@/lib/constants'
import { createDeck, createDeckSchema } from '@/lib/decks'

export async function POST(request: Request) {
  const body = await request.json()
  const result = createDeckSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const deck = await createDeck(TEMP_USER_ID, result.data)

  return NextResponse.json({ id: deck.id }, { status: 201 })
}
