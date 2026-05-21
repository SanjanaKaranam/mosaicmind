function shuffle(letters: string[]): string[] {
  const arr = [...letters]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function scramble(word: string): string {
  const letters = word.split('')
  const maxAttempts = 20
  for (let i = 0; i < maxAttempts; i++) {
    const result = shuffle(letters).join('')
    if (result !== word) return result
  }
  return shuffle(letters).join('')
}
