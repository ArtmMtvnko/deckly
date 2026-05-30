import { describe, it, expect } from 'vitest'

import { createDeckSchema, rateDeckSchema } from '@/lib/decks/deck.schemas'

const textCard = {
  frontsideText: 'front',
  backsideText: 'back',
}

describe('createDeckSchema', () => {
  it('accepts a deck with a title and a fully filled card', () => {
    const result = createDeckSchema.safeParse({
      title: 'My deck',
      flashcards: [textCard],
    })
    expect(result.success).toBe(true)
  })

  it('rejects a card that is empty on both sides', () => {
    const result = createDeckSchema.safeParse({
      title: 'My deck',
      flashcards: [{ frontsideText: '', backsideText: '' }],
    })
    expect(result.success).toBe(false)
  })

  it('accepts a card that uses images instead of text', () => {
    const result = createDeckSchema.safeParse({
      title: 'My deck',
      flashcards: [
        {
          frontsideText: '',
          backsideText: '',
          frontsideImage: 'https://example.com/a.png',
          backsideImage: 'https://example.com/b.png',
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('treats whitespace-only text as empty', () => {
    const result = createDeckSchema.safeParse({
      title: 'My deck',
      flashcards: [{ frontsideText: '   ', backsideText: '   ' }],
    })
    expect(result.success).toBe(false)
  })

  it('requires a non-empty title', () => {
    const result = createDeckSchema.safeParse({
      title: '',
      flashcards: [textCard],
    })
    expect(result.success).toBe(false)
  })

  it('requires at least one flashcard', () => {
    const result = createDeckSchema.safeParse({
      title: 'My deck',
      flashcards: [],
    })
    expect(result.success).toBe(false)
  })
})

describe('rateDeckSchema', () => {
  it('accepts an integer rating between 1 and 5', () => {
    expect(rateDeckSchema.safeParse({ rating: 4 }).success).toBe(true)
  })

  it('rejects ratings outside the 1 to 5 range', () => {
    expect(rateDeckSchema.safeParse({ rating: 0 }).success).toBe(false)
    expect(rateDeckSchema.safeParse({ rating: 6 }).success).toBe(false)
  })

  it('rejects a non-integer rating', () => {
    expect(rateDeckSchema.safeParse({ rating: 3.5 }).success).toBe(false)
  })
})
