import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { requireUserId } from '@/lib/auth/session'
import { searchUnsplashPhotos, unsplashQuerySchema } from '@/lib/unsplash'

export async function GET(request: NextRequest) {
  await requireUserId()

  const { searchParams } = request.nextUrl
  const result = unsplashQuerySchema.safeParse({
    q: searchParams.get('q') ?? '',
  })

  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid search query', issues: result.error.issues },
      { status: 400 }
    )
  }

  const images = await searchUnsplashPhotos(result.data.q)
  return NextResponse.json({ images })
}
