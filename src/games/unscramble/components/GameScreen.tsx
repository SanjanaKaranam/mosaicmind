import { useCallback, useEffect, useRef, useState } from 'react'
import Timer from './Timer'
import ScrambledWord from './ScrambledWord'
import AnswerInput from './AnswerInput'
import HowToPlayModal from './HowToPlayModal'
import { useDefinition, getAnagrams, getAnagramCount } from '../hooks/useDefinition'
import type { TimingMode, HintsUsed } from '../hooks/useUnscramble'
import { buildMerged } from '../hooks/useUnscramble'

const TIMER_SECONDS    = 30
const MAX_LETTER_HINTS = 3
const REVEAL_COUNTDOWN = 3

async function fetchSingleDef(word: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!res.ok) throw new Error()
    const data = await res.json()
    const def = data[0]?.meanings[0]?.definitions[0]?.definition
    if (def) return def
    throw new Error()
  } catch {
    try {
      const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      const raw = data.en?.[0]?.definitions?.[0]?.definition
      if (!raw) throw new Error()
      return raw.replace(/<[^>]+>/g, '').trim() || null
    } catch {
      return null
    }
  }
}

function AnagramTiles({ word }: { word: string }) {
  const len = word.length
  const fs  = len <= 4 ? '7rem' : len <= 6 ? '6rem' : len <= 8 ? '5rem' : len <= 10 ? '4rem' : len <= 12 ? '3.25rem' : '2.75rem'
  return (
    <div className="flex gap-1 justify-center" style={{ flexWrap: 'nowrap' }}>
      {word.split('').map((letter, i) => (
        <span
          key={i}
          className="leading-none uppercase select-none"
          style={{ fontFamily: "'Keycapsflf', monospace", color: '#86efac', fontSize: fs }}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

function RevealedAnagram({ word }: { word: string }) {
  const [def, setDef]         = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fetched               = useRef(false)

  function handleMouseEnter() {
    if (fetched.current) return
    fetched.current = true
    setLoading(true)
    fetchSingleDef(word).then(text => { setDef(text); setLoading(false) })
  }

  return (
    <div className="flex flex-col items-center gap-2" onMouseEnter={handleMouseEnter}>
      <AnagramTiles word={word} />
      {(loading || def) && (
        <p className="text-sm text-white/70 italic max-w-xs text-center">
          {loading ? 'Loading...' : def}
        </p>
      )}
    </div>
  )
}

interface Props {
  currentRound:    number
  totalRounds:     number
  score:           number
  scrambled:       string
  currentWord:     string
  input:           string
  timeLeft:        number
  timing:          TimingMode
  revealedIndices: number[]
  hintsUsed:       HintsUsed
  paused:          boolean
  correctFlash:    boolean
  revealed:        boolean
  revealReason:    'timeout' | 'manual'
  onNext:          () => void
  onInput:         (value: string) => void
  onLetterHint:    () => void
  onRevealWord:    () => void
  onDefinitionHint: () => void
  onPause:         () => void
  onGoHome:        () => void
  onRestart:       () => void
  onShuffle:       () => void
}

function letterCount(word: string): Record<string, number> {
  const count: Record<string, number> = {}
  for (const ch of word) count[ch] = (count[ch] || 0) + 1
  return count
}

export default function GameScreen({
  currentRound, totalRounds, score, scrambled, currentWord,
  input, timeLeft, timing, revealedIndices, paused, correctFlash,
  revealed, revealReason, onNext, onInput, onLetterHint, onRevealWord,
  onDefinitionHint, onPause, onGoHome, onShuffle,
}: Props) {
  const canHint   = timing !== 'timed'
  const maxUserLen = currentWord.length - revealedIndices.length
  const { entries: defEntries, shown: defShown, fetchDefinition } = useDefinition(currentWord)
  const [howToPlayOpen, setHowToPlayOpen]             = useState(false)
  const [letterHintsThisWord, setLetterHintsThisWord] = useState(0)
  const [revealCountdown, setRevealCountdown]         = useState(REVEAL_COUNTDOWN)
  const [cursorPos, setCursorPos]                     = useState(0)
  const cursorPosRef                                  = useRef(0)
  const [slots, setSlots]                             = useState<string[]>(() => Array(Math.max(0, maxUserLen)).fill(''))
  const slotsRef                                      = useRef<string[]>([])

  useEffect(() => { cursorPosRef.current = cursorPos }, [cursorPos])
  useEffect(() => { slotsRef.current = slots }, [slots])
  useEffect(() => { setLetterHintsThisWord(0) }, [currentWord])
  useEffect(() => {
    const len = Math.max(0, currentWord.length - revealedIndices.length)
    setSlots(Array(len).fill(''))
    setCursorPos(0)
  }, [currentWord, revealedIndices.length])

  useEffect(() => {
    if (revealed) setRevealCountdown(REVEAL_COUNTDOWN)
  }, [revealed])

  useEffect(() => {
    if (!revealed || timing !== 'timed') return
    if (revealCountdown <= 0) { onNext(); return }
    const t = setTimeout(() => setRevealCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [revealed, timing, revealCountdown, onNext])

  // Sparse-slot handler for untimed mode — each box is independently addressable
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const cp           = cursorPosRef.current
    const currentSlots = slotsRef.current
    const maxLen       = currentWord.length - revealedIndices.length

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setCursorPos(p => Math.max(0, p - 1))
      return
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setCursorPos(p => Math.min(maxLen - 1, p + 1))
      return
    }
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newSlots = [...currentSlots]
      if (newSlots[cp]) {
        newSlots[cp] = ''
        setSlots(newSlots)
        onInput(newSlots.filter(Boolean).join(''))
      } else if (cp > 0) {
        newSlots[cp - 1] = ''
        setSlots(newSlots)
        setCursorPos(cp - 1)
        onInput(newSlots.filter(Boolean).join(''))
      }
      return
    }
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault()
      const letter        = e.key.toLowerCase()
      const lockedStr     = revealedIndices.map(i => currentWord[i]).join('')
      const lockedCount   = letterCount(lockedStr)
      const fullAvailable = letterCount(currentWord)
      const effectiveAvail = (fullAvailable[letter] || 0) - (lockedCount[letter] || 0)
      const usedElsewhere  = currentSlots.reduce((n, s, i) => n + (i !== cp && s === letter ? 1 : 0), 0)
      if (usedElsewhere < effectiveAvail) {
        const newSlots = [...currentSlots]
        newSlots[cp] = letter
        setSlots(newSlots)
        onInput(newSlots.filter(Boolean).join(''))
        if (cp < maxLen - 1) setCursorPos(cp + 1)
      }
    }
  }, [onInput, currentWord, revealedIndices])

  // Type anywhere in timed mode — fires when focus is NOT on the hidden input (e.g. after clicking Shuffle)
  useEffect(() => {
    if (timing !== 'timed' || paused || revealed) return
    const lockedStr     = revealedIndices.map(i => currentWord[i]).join('')
    const lockedCount   = letterCount(lockedStr)
    const fullAvailable = letterCount(currentWord)
    const userUsed      = letterCount(input)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return  // input's own onKeyDown handles it
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Backspace') {
        e.preventDefault()
        onInput(input.slice(0, -1))
        return
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        const letter = e.key.toLowerCase()
        const effectiveAvail = (fullAvailable[letter] || 0) - (lockedCount[letter] || 0)
        if ((userUsed[letter] || 0) < effectiveAvail && input.length < maxUserLen) {
          onInput(input + letter)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [timing, input, onInput, currentWord, paused, revealed, revealedIndices])

  function handleLetterHint() {
    if (letterHintsThisWord >= MAX_LETTER_HINTS) return
    onLetterHint()
    setLetterHintsThisWord(n => n + 1)
  }

  function handleDefinitionClick() {
    fetchDefinition()
    onDefinitionHint()
  }

  const revealAnagrams = revealed ? getAnagrams(currentWord) : []
  const isLastWord     = currentRound + 1 >= totalRounds
  const anagramCount   = getAnagramCount(currentWord)

  const btnBase = 'px-5 py-2 rounded-lg border-2 border-white/20 bg-black/40 text-sm text-white hover:border-white/50 transition-colors'

  return (
    <div className="flex flex-col items-center gap-8 py-10 px-6 max-w-5xl mx-auto w-full">

      {/* Round / score strip */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest bg-black/40 border border-white/20 px-3 py-1.5 rounded-full text-white/80">
          Word {currentRound + 1} / {totalRounds}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest bg-black/40 border border-white/20 px-3 py-1.5 rounded-full text-[var(--accent-text)]">
          Score {score}
        </span>
      </div>

      {/* Timer */}
      {timing === 'timed' && (
        <div className="w-full flex items-center gap-3">
          <div className="flex-1">
            <Timer timeLeft={timeLeft} total={TIMER_SECONDS} />
          </div>
          <button
            onClick={onPause}
            className={btnBase}
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
      )}

      {/* ── Revealed state ── */}
      {revealed ? (
        <div className="flex flex-col items-center gap-6 w-full">
          <ScrambledWord scrambled={scrambled} input="" revealedIndices={[]} currentWord={currentWord} />

          <div className="flex flex-col items-center gap-1">
            <div className="w-full border-t border-white/20" />
            <span className={`text-sm font-semibold uppercase tracking-widest pt-3 ${revealReason === 'timeout' ? 'text-red-400' : 'text-[var(--accent-text)]'}`}>
              {revealReason === 'timeout' ? "Time's up!" : 'Word revealed'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            {revealAnagrams.map(word => (
              <div key={word} className="flex flex-col items-center gap-1">
                {revealAnagrams.length > 1 && (
                  <span className="text-xs text-white/50 uppercase tracking-wider">{word}</span>
                )}
                {timing === 'timed' ? <AnagramTiles word={word} /> : <RevealedAnagram word={word} />}
              </div>
            ))}
          </div>

          {timing === 'timed' ? (
            <p className="text-white/60 text-lg">
              Next word in <span className="text-white font-bold">{revealCountdown}</span>...
            </p>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={onNext}
                className="px-10 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-lg font-semibold transition-colors"
              >
                {isLastWord ? 'See results' : 'Next word →'}
              </button>
              <button onClick={onGoHome} className="text-white/40 hover:text-white text-sm transition-colors">
                ← Mode select
              </button>
            </div>
          )}
        </div>

      /* ── Paused state ── */
      ) : paused ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <span className="text-3xl font-bold tracking-widest uppercase text-white drop-shadow-lg">Paused</span>
          <button
            onClick={onPause}
            className="px-10 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-lg font-semibold transition-colors"
          >
            ▶ Resume
          </button>
          <button
            onClick={() => setHowToPlayOpen(true)}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ? How to Play
          </button>
          {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}
        </div>

      /* ── Active game ── */
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            <ScrambledWord
              scrambled={scrambled}
              input={buildMerged(input, currentWord, revealedIndices)}
              revealedIndices={[]}
              currentWord={currentWord}
            />
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={onShuffle} className={btnBase}>⇄ Shuffle</button>
              <button onClick={() => {
                setSlots(Array(Math.max(0, currentWord.length - revealedIndices.length)).fill(''))
                onInput('')
              }} className={btnBase}>× Clear</button>
            </div>
          </div>

          <AnswerInput
            value={input}
            currentWord={currentWord}
            onChange={onInput}
            disabled={correctFlash}
            correctFlash={correctFlash}
            revealedIndices={revealedIndices}
            cursorPos={timing !== 'timed' ? cursorPos : undefined}
            onCursorMove={timing !== 'timed' ? setCursorPos : undefined}
            onInputKeyDown={timing !== 'timed' ? handleInputKeyDown : undefined}
            slots={timing !== 'timed' ? slots : undefined}
          />

          {canHint && (
            <div className="flex flex-col items-center gap-3 w-full max-w-lg">
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={handleLetterHint}
                  disabled={letterHintsThisWord >= MAX_LETTER_HINTS}
                  className={`px-6 py-3 rounded-xl border-2 text-base transition-colors ${
                    letterHintsThisWord >= MAX_LETTER_HINTS
                      ? 'border-white/10 bg-black/20 text-white/30 cursor-not-allowed'
                      : btnBase
                  }`}
                >
                  💡 Letter hint ({MAX_LETTER_HINTS - letterHintsThisWord})
                </button>
                <button onClick={onRevealWord} className={`px-6 py-3 rounded-xl border-2 text-base transition-colors ${btnBase}`}>
                  👁 Reveal word
                </button>
                <button
                  onClick={handleDefinitionClick}
                  disabled={defShown}
                  className={`px-6 py-3 rounded-xl border-2 text-base transition-colors ${
                    defShown ? 'border-white/10 bg-black/20 text-white/30 cursor-default' : btnBase
                  }`}
                >
                  📖 Definition ({anagramCount})
                </button>
              </div>

              {defShown && (
                <div className="w-full rounded-xl bg-black/50 border border-white/15 px-5 py-4 flex flex-col gap-3">
                  {(() => {
                    const wordRevealed  = revealedIndices.length >= currentWord.length
                    const anyHinted     = revealedIndices.length > 0
                    const showWordLabel = wordRevealed || anyHinted
                    const allLoading    = defEntries.every(e => e.loading)
                    if (allLoading) return <p className="text-sm text-white/40 italic">Loading...</p>
                    const visible = defEntries.filter(e => e.loading || e.text !== 'Could not load definition')
                    if (visible.length === 0) return <p className="text-sm text-white/40 italic">Could not load definitions</p>
                    return visible.map((e, i) => (
                      <div key={e.word}>
                        {(visible.length > 1 || showWordLabel) && (
                          <div className="flex items-center gap-2 mb-1">
                            {visible.length > 1 && (
                              <span className="text-xs text-white/40 uppercase tracking-wider">Definition {i + 1}</span>
                            )}
                            {showWordLabel && (
                              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">{e.word}</span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-white/80 italic">
                          {e.loading ? 'Loading...' : e.text}
                        </p>
                      </div>
                    ))
                  })()}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
