import { describe, it, expect } from 'vitest'

import { calculateSm2 } from '@/lib/srs/sm2'
import { QUALITY_MAP } from '@/lib/srs/srs.types'
import type { SRSInput } from '@/lib/srs/srs.types'

const baseInput: SRSInput = {
  repetitions: 0,
  intervalDays: 1,
  easeFactor: 2.5,
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

describe('calculateSm2', () => {
  it('resets repetitions and interval on a failing grade (quality < 3)', () => {
    const result = calculateSm2(
      { repetitions: 5, intervalDays: 30, easeFactor: 2.5 },
      2
    )

    expect(result.repetitions).toBe(0)
    expect(result.intervalDays).toBe(1)
  })

  it('sets interval to 1 on the first successful repetition', () => {
    const result = calculateSm2(baseInput, 4)

    expect(result.repetitions).toBe(1)
    expect(result.intervalDays).toBe(1)
  })

  it('sets interval to 6 on the second successful repetition', () => {
    const result = calculateSm2(
      { repetitions: 1, intervalDays: 1, easeFactor: 2.5 },
      4
    )

    expect(result.repetitions).toBe(2)
    expect(result.intervalDays).toBe(6)
  })

  it('scales interval by the ease factor from the third repetition onward', () => {
    const result = calculateSm2(
      { repetitions: 2, intervalDays: 6, easeFactor: 2.5 },
      4
    )

    expect(result.repetitions).toBe(3)
    // 6 * 2.5 = 15
    expect(result.intervalDays).toBe(15)
  })

  it('increases the ease factor on a perfect grade (quality 5)', () => {
    const result = calculateSm2(baseInput, 5)
    expect(result.easeFactor).toBeGreaterThan(baseInput.easeFactor)
  })

  it('decreases the ease factor on a barely-passing grade (quality 3)', () => {
    const result = calculateSm2(baseInput, 3)
    expect(result.easeFactor).toBeLessThan(baseInput.easeFactor)
  })

  it('never lets the ease factor drop below the 1.3 floor', () => {
    const result = calculateSm2(
      { repetitions: 0, intervalDays: 1, easeFactor: 1.3 },
      1
    )
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
  })

  it('schedules nextReview intervalDays ahead of today', () => {
    const result = calculateSm2(
      { repetitions: 2, intervalDays: 6, easeFactor: 2.5 },
      4
    )
    expect(daysBetween(new Date(), result.nextReview)).toBe(result.intervalDays)
  })
})

describe('QUALITY_MAP', () => {
  it('maps answer ratings to their numeric quality values', () => {
    expect(QUALITY_MAP).toEqual({ again: 1, hard: 2, good: 4, easy: 5 })
  })
})
