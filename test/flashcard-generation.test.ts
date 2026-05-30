import { describe, it, expect, vi, beforeEach } from 'vitest'

// The async dependencies are mocked so we can unit-test the orchestration
// logic (image-intent detection, which side the image is attached to) without
// touching the Gemini or Unsplash networks. Mocking the gemini module also
// sidesteps its `server-only` import and GEMINI_API_KEY requirement.
// Defined via vi.hoisted so they exist when the hoisted vi.mock factories run.
const { generateContent, searchUnsplashPhotos } = vi.hoisted(() => ({
  generateContent: vi.fn(),
  searchUnsplashPhotos: vi.fn(),
}))

vi.mock('@/lib/ai/gemini', () => ({
  gemini: { models: { generateContent } },
}))

vi.mock('@/lib/unsplash', () => ({
  searchUnsplashPhotos,
}))

import { generateFlashcards } from '@/lib/ai/flashcard-generation'

const CARDS = [
  { frontsideText: 'Q1', backsideText: 'A1', imageSearchQuery: 'apple' },
  { frontsideText: 'Q2', backsideText: 'A2', imageSearchQuery: 'banana' },
  { frontsideText: 'Q3', backsideText: 'A3', imageSearchQuery: 'cherry' },
]

/** Queue the two Gemini calls generateFlashcards makes: classify, then cards. */
function mockGemini(type: string, cards: unknown[]) {
  generateContent
    .mockResolvedValueOnce({ text: JSON.stringify({ type }) })
    .mockResolvedValueOnce({ text: JSON.stringify(cards) })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('generateFlashcards', () => {
  it('returns cards as-is and never calls Unsplash when no image intent', async () => {
    mockGemini('qa', CARDS)

    const result = await generateFlashcards('teach me about fruit')

    expect(searchUnsplashPhotos).not.toHaveBeenCalled()
    expect(result).toHaveLength(3)
    expect(result[0]).not.toHaveProperty('frontsideImageUrl')
    expect(result[0]).not.toHaveProperty('backsideImageUrl')
  })

  it('attaches images to the backside for qa cards when images are requested', async () => {
    mockGemini('qa', CARDS)
    searchUnsplashPhotos.mockResolvedValue([
      { smallUrl: 'https://img/x.jpg' },
    ])

    const result = await generateFlashcards('fruit facts with pictures')

    expect(searchUnsplashPhotos).toHaveBeenCalled()
    expect(result[0].backsideImageUrl).toBe('https://img/x.jpg')
    expect(result[0].frontsideImageUrl).toBeUndefined()
  })

  it('attaches images to the frontside for non-qa cards', async () => {
    mockGemini('vocabulary', CARDS)
    searchUnsplashPhotos.mockResolvedValue([
      { smallUrl: 'https://img/y.jpg' },
    ])

    const result = await generateFlashcards('vocabulary with images please')

    expect(result[0].frontsideImageUrl).toBe('https://img/y.jpg')
    expect(result[0].backsideImageUrl).toBeUndefined()
  })

  it('falls back to null image when Unsplash finds nothing', async () => {
    mockGemini('vocabulary', CARDS)
    searchUnsplashPhotos.mockResolvedValue([])

    const result = await generateFlashcards('show me photos of fruit')

    expect(result[0].frontsideImageUrl).toBeNull()
  })
})
