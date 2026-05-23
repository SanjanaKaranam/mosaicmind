import { useState, useEffect, useCallback, useRef } from 'react'
import { pickWords } from '../utils/pickWords'
import { scramble } from '../utils/scramble'
import { checkAnswer } from '../utils/checkAnswer'

export type PlayMode = 'daily' | 'random' | 'unlimited'
export type TimingMode = 'timed' | 'untimed'

export interface GameMode {
  play: PlayMode
  timing: TimingMode
  wordCount?: number  // unlimited only: how many words to play (undefined = 200)
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
const LAST_KEY = 'unscramble_last_key'

function getStorageKey(mode: GameMode): string | null {
  if (mode.play === 'unlimited') return null
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
    localStorage.setItem(LAST_KEY, key)
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
  const [revealReason, setRevealReason] = useState<'timeout' | 'manual'>('timeout')
  const [paused, setPaused] = useState(false)

  const timeLeftRef = useRef(timeLeft)
  const modeRef = useRef(mode)
  const phaseRef = useRef(phase)
  useEffect(() => { timeLeftRef.current = timeLeft }, [timeLeft])
  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { phaseRef.current = phase }, [phase])

  const currentWord = words[currentRound] ?? ''
  const totalRounds = words.length

  // Auto-restore game on mount (daily/random only — unlimited is not persisted)
  useEffect(() => {
    try {
      const lastKey = localStorage.getItem(LAST_KEY)
      if (!lastKey) return
      const saved = loadProgress(lastKey)
      if (!saved?.mode || !saved?.words?.length || saved.currentRound >= saved.words.length) return
      if (saved.mode.play === 'daily') {
        const today = new Date().toISOString().slice(0, 10)
        if (!lastKey.includes(today)) return
      }
      setMode(saved.mode)
      setWords(saved.words)
      setCurrentRound(saved.currentRound)
      setScrambled(scramble(saved.words[saved.currentRound]))
      setScore(saved.score ?? 0)
      setWrongWords(saved.wrongWords ?? [])
      setHintsUsed(saved.hintsUsed ?? { letters: 0, definitions: 0 })
      setTimeLeft(saved.timeLeft ?? TIMER_SECONDS)
      setRevealedIndices([])
      setInput('')
      setPhase('playing')
    } catch {}
  }, [])

  // Persist progress during play (daily/random only)
  useEffect(() => {
    if (!mode || phase === 'idle' || phase === 'finished' || mode.play === 'unlimited' || words.length === 0) return
    const key = getStorageKey(mode)
    if (!key) return
    saveProgress(key, { mode, words, currentRound, score, wrongWords, hintsUsed, timeLeft })
  }, [currentRound, score, wrongWords, hintsUsed, phase, mode, words, timeLeft])

  // Save exact timeLeft on page close
  useEffect(() => {
    const handleBeforeUnload = () => {
      const m = modeRef.current
      if (!m || phaseRef.current !== 'playing' || m.play === 'unlimited') return
      const key = getStorageKey(m)
      if (!key) return
      const existing = loadProgress(key)
      if (existing) saveProgress(key, { ...existing, timeLeft: timeLeftRef.current })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Clear progress and record completion when game finishes
  useEffect(() => {
    if (phase !== 'finished' || !mode) return
    const key = getStorageKey(mode)
    if (key) localStorage.removeItem(key)
    localStorage.removeItem(LAST_KEY)
    if (mode.play === 'daily') {
      const today = new Date().toISOString().slice(0, 10)
      try {
        const doneKey = `unscramble_daily_done_${today}`
        const existing = localStorage.getItem(doneKey)
        const done = existing ? JSON.parse(existing) : {}
        done[mode.timing] = true
        localStorage.setItem(doneKey, JSON.stringify(done))
      } catch {}
    }
  }, [phase, mode])

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing' || mode?.timing !== 'timed' || paused) return
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [phase, mode, paused])

  // Auto-pause when tab goes to background (timed only)
  useEffect(() => {
    if (phase !== 'playing' || mode?.timing !== 'timed') return
    const handleVisibility = () => { if (document.hidden) setPaused(true) }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [phase, mode])

  // Timer hit zero → wrong answer → reveal
  useEffect(() => {
    if (phase !== 'playing' || mode?.timing !== 'timed' || timeLeft > 0) return
    setWrongWords(prev => [...prev, { word: currentWord, playerInput: '' }])
    setRevealReason('timeout')
    setPhase('reveal')
  }, [timeLeft, phase, mode, currentWord])

  const advanceFromReveal = useCallback(() => {
    const next = currentRound + 1
    if (next >= words.length) {
      setPhase('finished')
      return
    }
    setCurrentRound(next)
    setScrambled(scramble(words[next]))
    setInput('')
    setTimeLeft(TIMER_SECONDS)
    setRevealedIndices([])
    setRevealReason('timeout')
    setPaused(false)
    setPhase('playing')
  }, [currentRound, words])

  const startGame = useCallback((selectedMode: GameMode) => {
    const key = getStorageKey(selectedMode)
    const saved = key ? loadProgress(key) : null

    setMode(selectedMode)
    setInput('')
    setRevealedIndices([])
    setPaused(false)

    if (saved?.words?.length && saved.currentRound < saved.words.length) {
      setWords(saved.words)
      setCurrentRound(saved.currentRound)
      setScrambled(scramble(saved.words[saved.currentRound]))
      setScore(saved.score ?? 0)
      setWrongWords(saved.wrongWords ?? [])
      setHintsUsed(saved.hintsUsed ?? { letters: 0, definitions: 0 })
      setTimeLeft(saved.timeLeft ?? TIMER_SECONDS)
    } else {
      const newWords = pickWords(selectedMode.play, selectedMode.wordCount)
      setWords(newWords)
      setCurrentRound(0)
      setScrambled(scramble(newWords[0]))
      setScore(0)
      setWrongWords([])
      setHintsUsed({ letters: 0, definitions: 0 })
      setTimeLeft(TIMER_SECONDS)
    }

    setPhase('playing')
  }, [])

  const [correctFlash, setCorrectFlash] = useState(false)

  const handleInput = useCallback((value: string) => {
    setInput(value)
    if (value.length < currentWord.length) return

    if (checkAnswer(value, currentWord)) {
      setScore(s => s + 1)
      setCorrectFlash(true)
      setTimeout(() => {
        setCorrectFlash(false)
        const next = currentRound + 1
        if (next >= words.length) {
          setPhase('finished')
          return
        }
        setCurrentRound(next)
        setScrambled(scramble(words[next]))
        setInput('')
        setTimeLeft(TIMER_SECONDS)
        setRevealedIndices([])
      }, 600)
    }
    // Wrong answer: leave input so the user can backspace and correct it
  }, [currentWord, currentRound, words])

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

  const revealWord = useCallback(() => {
    if (!currentWord) return
    const newlyRevealed = currentWord.split('').map((_, i) => i).filter(i => !revealedIndices.includes(i))
    if (newlyRevealed.length === 0) return
    setRevealedIndices(currentWord.split('').map((_, i) => i))
    setHintsUsed(prev => ({ ...prev, letters: prev.letters + newlyRevealed.length }))
    setWrongWords(prev => [...prev, { word: currentWord, playerInput: input }])
    setRevealReason('manual')
    setPhase('reveal')
  }, [currentWord, revealedIndices, input])

  const shuffleScramble = useCallback(() => {
    if (currentWord) setScrambled(scramble(currentWord))
  }, [currentWord])

  const goHome = useCallback(() => {
    localStorage.removeItem(LAST_KEY)
    setPhase('idle')
  }, [])

  const endGame = useCallback(() => { setPhase('finished') }, [])

  const restartGame = useCallback(() => {
    if (!mode) return
    const key = getStorageKey(mode)
    if (key) localStorage.removeItem(key)
    localStorage.removeItem(LAST_KEY)
    const newWords = pickWords(mode.play, mode.wordCount)
    setWords(newWords)
    setCurrentRound(0)
    setScrambled(scramble(newWords[0]))
    setScore(0)
    setWrongWords([])
    setHintsUsed({ letters: 0, definitions: 0 })
    setInput('')
    setTimeLeft(TIMER_SECONDS)
    setRevealedIndices([])
    setRevealReason('timeout')
    setPaused(false)
    setPhase('playing')
  }, [mode])

  const replayGame = useCallback(() => {
    if (!mode || words.length === 0) return
    const key = getStorageKey(mode)
    if (key) localStorage.removeItem(key)
    setCurrentRound(0)
    setScrambled(scramble(words[0]))
    setScore(0)
    setWrongWords([])
    setHintsUsed({ letters: 0, definitions: 0 })
    setInput('')
    setTimeLeft(TIMER_SECONDS)
    setRevealedIndices([])
    setRevealReason('timeout')
    setPaused(false)
    setPhase('playing')
  }, [mode, words])

  const resetGame = useCallback(() => {
    if (mode) {
      const key = getStorageKey(mode)
      if (key) localStorage.removeItem(key)
    }
    localStorage.removeItem(LAST_KEY)
    setPhase('idle')
    setMode(null)
    setWords([])
    setCurrentRound(0)
    setScrambled('')
    setInput('')
    setScore(0)
    setTimeLeft(TIMER_SECONDS)
    setWrongWords([])
    setHintsUsed({ letters: 0, definitions: 0 })
    setRevealedIndices([])
    setRevealReason('timeout')
    setPaused(false)
  }, [mode])

  return {
    phase,
    mode,
    currentRound,
    currentWord,
    scrambled,
    input,
    score,
    timeLeft,
    wrongWords,
    hintsUsed,
    revealedIndices,
    totalRounds,
    startGame,
    correctFlash,
    handleInput,
    useLetterHint,
    revealWord,
    trackDefinitionHint,
    shuffleScramble,
    goHome,
    endGame,
    restartGame,
    replayGame,
    resetGame,
    revealReason,
    advanceFromReveal,
    paused,
    togglePause: useCallback(() => setPaused(p => !p), []),
  }
}
