import fourLetter from '../../../data/unscramble/4-letter.json'
import fiveLetter from '../../../data/unscramble/5-letter.json'
import sixLetter from '../../../data/unscramble/6-letter.json'
import sevenLetter from '../../../data/unscramble/7-letter.json'
import eightLetter from '../../../data/unscramble/8-letter.json'

const WORD_LISTS: Record<number, string[]> = {
  4: fourLetter,
  5: fiveLetter,
  6: sixLetter,
  7: sevenLetter,
  8: eightLetter,
}

// rounds 1-3: 4 letters, 4-6: 5 letters, 7-10: 6 letters, 11-14: 7 letters, 15-17: 8 letters
const ROUND_COUNTS: [number, number][] = [
  [4, 3],
  [5, 3],
  [6, 4],
  [7, 4],
  [8, 3],
]

function hashSeed(str: string): number {
  let hash = 0
  for (const char of str) {
    hash = (hash << 5) - hash + char.charCodeAt(0)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickUnique(list: string[], count: number, rand: () => number): string[] {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

export function pickWords(mode: 'daily' | 'random'): string[] {
  const seed =
    mode === 'daily'
      ? hashSeed(new Date().toISOString().slice(0, 10))
      : Math.floor(Math.random() * 2 ** 32)

  const rand = seededRandom(seed)

  return ROUND_COUNTS.flatMap(([len, count]) =>
    pickUnique(WORD_LISTS[len], count, rand)
  )
}
