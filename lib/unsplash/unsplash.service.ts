import 'server-only'

export interface UnsplashImage {
  id: string
  thumbUrl: string
  smallUrl: string
  alt: string | null
}

interface UnsplashSearchResponse {
  results: Array<{
    id: string
    alt_description: string | null
    urls: {
      thumb: string
      small: string
    }
  }>
}

const SEARCH_ENDPOINT = 'https://api.unsplash.com/search/photos'

export async function searchUnsplashPhotos(
  query: string,
  perPage = 20
): Promise<UnsplashImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY is not configured')
  }

  const url = new URL(SEARCH_ENDPOINT)
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('content_filter', 'high')

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Unsplash search failed: ${response.status}`)
  }

  const data = (await response.json()) as UnsplashSearchResponse

  return data.results.map((photo) => ({
    id: photo.id,
    thumbUrl: photo.urls.thumb,
    smallUrl: photo.urls.small,
    alt: photo.alt_description,
  }))
}
