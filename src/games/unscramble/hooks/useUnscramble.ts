import { useState, useEffect, useCallback } from 'react'
import { pickWords } from '../utils/pickWords'
import { scramble } from '../utils/scramble'
import { checkAnswer } from '../utils/checkAnswer'

export type PlayMode = 'daily' | 'random'
export type TimingMode = 'timed' | 'untimed' | 'unlimited'

export interface GameMode {
  play: PlayMode
  timing: TimingMode
}

export interface WrongWord {
  word: string
  playerInput: string
}

export interface HintsUsed {
  letters: number
  definitions: number
}

type Phase = 'idle' | 'playing' | 'reveal' | 'finished'

const TIMER_SECONDS = 30
const REVEAL_MS = 5000
const TOTAL_ROUNDS = 17

function getStorageKey(mode: GameMode): string | null {
  if (mode.timing === 'unlimited') return null
  const date = new Date().toISOString().slice(0, 10)
  if (mode.play === 'daily') return `unscramble_daily_${mode.timing}_${date}`
  return `unscramble_random_${mode.timing}`
}

function loadProgress(key: string) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveProgress(key: string, data: object) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

export function useUnscramble() {
  const [mode, setMode] = useState<GameMode | null>(null)
  const [words, setWords] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentRound, setCurrentRound] = useState(0)
  const [scrambled, setScrambled] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [wrongWords, setWrongWords] = useState<WrongWord[]>([])
  const [hintsUsed, setHintsUsed] = useState<HintsUsed>({ letters: 0, definitions: 0 })
  const [revealedIndices, setRevealedIndices] = useState<number[]>([])

  const currentWord = words[currentRound] ?? ''

  // Persist progress after each round (timed + untimed only)
  useEffect(() => {
    if (!mode || phase === 'idle' || mode.timing === 'unlimited' || words.length === 0) return
    const key = getStorageKey(mode)
    if (!key) return
    saveProgress(key, { words, currentRound, score, wrongWords, hintsUsed })
  }, [currentRound, score, wrongWords, hintsUsed, phase, mode, words])

  // Timer countdown (timed mode only)
  useEffect(() => {
    if (phase !== 'playing' || mode?.timing !== 'timed') return
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [phase, mode])

  // Timer hit zero → wrong answer
  useEffect(() => {
    if (phase !== 'playing' || mode?.timing !== 'timed' || timeLeft > 0) return
    setWrongWords(prev => [...prev, { word: currentWord, playerInput: '' }])
    setPhase('reveal')
  }, [timeLeft, phase, mode, currentWord])

  // Reveal phase → auto-advance after 5 seconds
  useEffect(() => {
    if (phase !== 'reveal') return
    const timeout = setTimeout(() => {
      const next = currentRound + 1
      if (next >= TOTAL_ROUNDS) {
        setPhase('finished')
        return
      }
      setCurrentRound(next)
      setScrambled(scramble(words[next]))
      setInput('')
      setTimeLeft(TIMER_SECONDS)
      setRevealedIndices([])
      setPhase('playing')
    }, REVEAL_MS)
    return () => clearTimeout(timeout)
  }, [phase, currentRound, words])

  const startGame = useCallback((selectedMode: GameMode) => {
    const key = getStorageKey(selectedMode)
    const saved = key ? loadProgress(key) : null

    setMode(selectedMode)
    setInput('')
    setTimeLeft(TIMER_SECONDS)
    setRevealedIndices([])

    if (saved?.words?.length && saved.currentRound < TOTAL_ROUNDS) {
      setWords(saved.words)
      setCurrentRound(saved.currentRound)
      setScrambled(scramble(saved.words[saved.currentRound]))
      setScore(saved.score ?? 0)
      setWrongWords(saved.wrongWords ?? [])
      setHintsUsed(saved.hintsUsed ?? { letters: 0, definitions: 0 })
    } else {
      const newWords = pickWords(selectedMode.play)
      setWords(newWords)
      setCurrentRound(0)
      setScrambled(scramble(newWords[0]))
      setScore(0)
      setWrongWords([])
      setHintsUsed({ letters: 0, definitions: 0 })
    }

    setPhase('playing')
  }, [])

  // Check answer on every keystroke; auto-advance on correct, handle wrong on full-length match
  const handleInput = useCallback((value: string) => {
    setInput(value)
    if (value.length < currentWord.length) return

    if (checkAnswer(value, currentWord)) {
      const next = currentRound + 1
      setScore(s => s + 1)
      if (next >= TOTAL_ROUNDS) {
        setPhase('finished')
        return
      }
      setCurrentRound(next)
      setScrambled(scramble(words[next]))
      setInput('')
      setTimeLeft(TIMER_SECONDS)
      setRevealedIndices([])
    } else {
      if (mode?.timing === 'unlimited') {
        setInput('')
        return
      }
      setWrongWords(prev => [...prev, { word: currentWord, playerInput: value }])
      setInput('')
      setPhase('reveal')
    }
  }, [currentWord, currentRound, words, mode])

  const useLetterHint = useCallback(() => {
    if (!currentWord) return
    const unrevealed = currentWord.split('').map((_, i) => i).filter(i => !revealedIndices.includes(i))
    if (unrevealed.length === 0) return
    const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)]
    setRevealedIndices(prev => [...prev, pick])
    setHintsUsed(prev => ({ ...prev, letters: prev.letters + 1 }))
  }, [currentWord, revealedIndices])

  const trackDefinitionHint = useCallback(() => {
    setHintsUsed(prev => ({ ...prev, definitions: prev.definitions + 1 }))
  }, [])

  return {
    phase,
    currentRound,
    currentWord,
    scrambled,
    input,
    score,
    timeLeft,
    wrongWords,
    hintsUsed,
    revealedIndices,
    totalRounds: TOTAL_ROUNDS,
    startGame,
    handleInput,
    useLetterHint,
    trackDefinitionHint,
  }
}
