import { NextResponse } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { recordReview } from '@/lib/decks'
import { recordReviewSchema } from '@/lib/srs/srs.schemas'

export async function POST(request: Request) {
  const userId = await requireUserId()
  const body = await request.json()
  const result = recordReviewSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const { flashcardId, rating } = result.data
  const review = await recordReview(userId, flashcardId, rating)

  return NextResponse.json(review)
}
