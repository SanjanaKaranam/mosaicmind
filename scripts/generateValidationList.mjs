import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const ENABLE_URL = 'https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt'
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '../src/data/unscramble')

function sortLetters(word) {
  return word.toLowerCase().split('').sort().join('')
}

// Load all existing game words and index by sorted-letter signature
const lengths = [4, 5, 6, 7, 8]
const signatureSet = new Set()

for (const len of lengths) {
  const raw = await readFile(join(DATA_DIR, `${len}-letter.json`), 'utf-8')
  const words = JSON.parse(raw)
  for (const word of words) signatureSet.add(sortLetters(word))
}
console.log(`Indexed ${signatureSet.size} unique letter signatures from game words`)

// Fetch full ENABLE list
console.log('Fetching ENABLE list...')
const res = await fetch(ENABLE_URL)
const text = await res.text()
const allWords = text.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length >= 4 && w.length <= 8)
console.log(`Loaded ${allWords.length} ENABLE words (4–8 letters)`)

// Keep only ENABLE words whose letters match a game word's signature
const validAnswers = []
for (const word of allWords) {
  if (signatureSet.has(sortLetters(word))) validAnswers.push(word)
}
validAnswers.sort()
console.log(`Found ${validAnswers.length} valid answer words`)

await writeFile(join(DATA_DIR, 'valid-answers.json'), JSON.stringify(validAnswers, null, 2))
console.log('Written → src/data/unscramble/valid-answers.json')
