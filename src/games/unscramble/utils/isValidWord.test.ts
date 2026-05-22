import { describe, it, expect } from 'vitest'
import { isValidWord } from './isValidWord'

describe('isValidWord', () => {
  it('accepts known valid words', () => {
    expect(isValidWord('garden')).toBe(true)
    expect(isValidWord('harvest')).toBe(true)
    expect(isValidWord('fate')).toBe(true)
  })

  it('is case insensitive', () => {
    expect(isValidWord('GARDEN')).toBe(true)
    expect(isValidWord('Garden')).toBe(true)
  })

  it('rejects made-up words', () => {
    expect(isValidWord('xyzabc')).toBe(false)
    expect(isValidWord('dnaerg')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidWord('')).toBe(false)
  })
})
