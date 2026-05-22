import { describe, it, expect } from 'vitest'
import { checkAnswer } from './checkAnswer'

describe('checkAnswer', () => {
  it('accepts the exact correct answer', () => {
    expect(checkAnswer('garden', 'garden')).toBe(true)
  })

  it('is case insensitive', () => {
    expect(checkAnswer('GARDEN', 'garden')).toBe(true)
    expect(checkAnswer('Garden', 'GARDEN')).toBe(true)
  })

  it('accepts a valid anagram of the answer', () => {
    expect(checkAnswer('fate', 'feat')).toBe(true)
    expect(checkAnswer('danger', 'gander')).toBe(true)
  })

  it('rejects a wrong word', () => {
    expect(checkAnswer('wrong', 'garden')).toBe(false)
  })

  it('rejects an anagram that is not a valid word', () => {
    expect(checkAnswer('dnaerg', 'garden')).toBe(false)
  })

  it('rejects an empty input', () => {
    expect(checkAnswer('', 'garden')).toBe(false)
  })

  it('trims whitespace', () => {
    expect(checkAnswer('  garden  ', 'garden')).toBe(true)
  })
})
