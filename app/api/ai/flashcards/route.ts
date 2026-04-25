import { NextResponse } from 'next/server'

import { generateFlashcards, generateFlashcardsRequestSchema } from '@/lib/ai'

export async function POST(request: Request) {
  const body = await request.json()
  const result = generateFlashcardsRequestSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const flashcards = await generateFlashcards(result.data.prompt)
  return NextResponse.json({ flashcards }, { status: 200 })
}
