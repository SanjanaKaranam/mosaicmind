import { useState, useEffect, useCallback } from 'react'
import validAnswers from '../../../data/unscramble/valid-answers.json'

export interface WordDefinition {
  word: string
  text: string | null
  loading: boolean
}

function sortedLetters(w: string) {
  return w.toLowerCase().split('').sort().join('')
}

export function getAnagrams(word: string): string[] {
  const sig = sortedLetters(word)
  return (validAnswers as string[]).filter(w => sortedLetters(w) === sig)
}

export function getAnagramCount(word: string): number {
  return getAnagrams(word).length
}

interface DefinitionState {
  entries: WordDefinition[]
  shown: boolean
}

export function useDefinition(word: string) {
  const [state, setState] = useState<DefinitionState>({ entries: [], shown: false })

  useEffect(() => {
    setState({ entries: [], shown: false })
  }, [word])

  const fetchDefinition = useCallback(async () => {
    if (state.shown || !word) return
    const anagrams = getAnagrams(word)
    setState({ entries: anagrams.map(w => ({ word: w, text: null, loading: true })), shown: true })

    const results = await Promise.all(
      anagrams.map(async (w): Promise<WordDefinition> => {
        try {
          const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`)
          if (!res.ok) throw new Error()
          const data = await res.json()
          const def = data[0]?.meanings[0]?.definitions[0]?.definition
          if (def) return { word: w, text: def, loading: false }
          throw new Error()
        } catch {
          // fallback to Wiktionary
          try {
            const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${w}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            const raw = data.en?.[0]?.definitions?.[0]?.definition
            if (!raw) throw new Error()
            const text = raw.replace(/<[^>]+>/g, '').trim()
            return { word: w, text: text || 'No definition available', loading: false }
          } catch {
            return { word: w, text: 'Could not load definition', loading: false }
          }
        }
      })
    )
    setState({ entries: results, shown: true })
  }, [word, state.shown])

  return { ...state, fetchDefinition }
}
