import { describe, it, expect } from 'vitest'
import { pickWords } from './pickWords'

describe('pickWords', () => {
  describe('daily mode', () => {
    it('returns 17 words', () => {
      expect(pickWords('daily')).toHaveLength(17)
    })

    it('returns the same words every call (deterministic)', () => {
      const first = pickWords('daily')
      const second = pickWords('daily')
      expect(first).toEqual(second)
    })

    it('returns words of increasing length', () => {
      const words = pickWords('daily')
      const lengths = words.map(w => w.length)
      // first words should be shorter (4-5 letters), last words longer (7-8)
      expect(lengths[0]).toBeLessThanOrEqual(5)
      expect(lengths[lengths.length - 1]).toBeGreaterThanOrEqual(7)
    })
  })

  describe('random mode', () => {
    it('returns 17 words', () => {
      expect(pickWords('random')).toHaveLength(17)
    })

    it('returns different words on different calls', () => {
      const results = Array.from({ length: 5 }, () => pickWords('random'))
      const unique = new Set(results.map(r => r.join(',')))
      expect(unique.size).toBeGreaterThan(1)
    })
  })

  describe('unlimited mode', () => {
    it('returns 200 words by default', () => {
      expect(pickWords('unlimited')).toHaveLength(200)
    })

    it('returns the requested word count', () => {
      expect(pickWords('unlimited', 50)).toHaveLength(50)
    })

    it('does not exceed the pool size', () => {
      const result = pickWords('unlimited', 9999)
      expect(result.length).toBeLessThanOrEqual(5584)
    })
  })
})
