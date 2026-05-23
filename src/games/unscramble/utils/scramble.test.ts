import { describe, it, expect } from 'vitest'
import { scramble } from './scramble'

describe('scramble', () => {
  it('returns a string with the same letters', () => {
    const word = 'garden'
    const result = scramble(word)
    expect(result.split('').sort().join('')).toBe(word.split('').sort().join(''))
  })

  it('returns the same length as the input', () => {
    const word = 'puzzle'
    expect(scramble(word).length).toBe(word.length)
  })

  it('tries not to return the original word', () => {
    const word = 'garden'
    const results = Array.from({ length: 20 }, () => scramble(word))
    expect(results.some(r => r !== word)).toBe(true)
  })

  it('handles single character words', () => {
    expect(scramble('a')).toBe('a')
  })

  it('only contains letters from the original word', () => {
    const word = 'harvest'
    const result = scramble(word)
    const sortedOriginal = word.split('').sort().join('')
    const sortedResult = result.split('').sort().join('')
    expect(sortedResult).toBe(sortedOriginal)
  })
})
