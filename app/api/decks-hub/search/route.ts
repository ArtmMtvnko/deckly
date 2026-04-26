import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { searchPublicDecks, searchParamsSchema } from '@/lib/search'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const result = searchParamsSchema.safeParse({
    query: searchParams.get('q') ?? '',
    page: searchParams.get('page') ?? 0,
    hitsPerPage: searchParams.get('hitsPerPage') ?? 12,
  })

  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid search parameters', issues: result.error.issues },
      { status: 400 }
    )
  }

  const data = await searchPublicDecks(
    result.data.query,
    result.data.page,
    result.data.hitsPerPage
  )
  return NextResponse.json(data)
}
