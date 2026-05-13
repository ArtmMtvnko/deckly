import { NextResponse } from 'next/server'

import { editFlashcard, editFlashcardRequestSchema } from '@/lib/ai'

export async function POST(request: Request) {
  const body = await request.json()
  const result = editFlashcardRequestSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const flashcard = await editFlashcard(result.data.card, result.data.instruction)
  return NextResponse.json({ flashcard }, { status: 200 })
}
