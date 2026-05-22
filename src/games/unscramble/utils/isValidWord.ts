import validAnswers from '../../../data/unscramble/valid-answers.json'

const wordSet = new Set<string>(validAnswers)

export function isValidWord(word: string): boolean {
  return wordSet.has(word.toLowerCase())
}
