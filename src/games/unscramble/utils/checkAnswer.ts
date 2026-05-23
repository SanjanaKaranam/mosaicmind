import { isValidWord } from './isValidWord'

function sortedLetters(word: string): string {
  return word.toLowerCase().split('').sort().join('')
}

export function checkAnswer(input: string, answer: string): boolean {
  const normInput = input.trim().toLowerCase()
  const normAnswer = answer.trim().toLowerCase()

  if (normInput === normAnswer) return true

  // Accept any valid English word that uses the exact same letters
  return sortedLetters(normInput) === sortedLetters(normAnswer) && isValidWord(normInput)
}
