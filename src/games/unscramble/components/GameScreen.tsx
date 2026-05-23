import { useEffect, useState } from 'react'
import Timer from './Timer'
import ScrambledWord from './ScrambledWord'
import AnswerInput from './AnswerInput'
import HowToPlayModal from './HowToPlayModal'
import { useDefinition, getAnagramCount } from '../hooks/useDefinition'
import type { TimingMode, HintsUsed } from '../hooks/useUnscramble'
import { useSettings } from '../../../context/SettingsContext'

const TIMER_SECONDS = 30
const MAX_LETTER_HINTS = 3

interface Props {
  currentRound: number
  totalRounds: number
  score: number
  scrambled: string
  currentWord: string
  input: string
  timeLeft: number
  timing: TimingMode
  revealedIndices: number[]
  hintsUsed: HintsUsed
  paused: boolean
  onInput: (value: string) => void
  onLetterHint: () => void
  onRevealWord: () => void
  onDefinitionHint: () => void
  onPause: () => void
  onGoHome: () => void
  onRestart: () => void
  onShuffle: () => void
  isUnlimited: boolean
  onEndGame: () => void
}

function letterCount(word: string): Record<string, number> {
  const count: Record<string, number> = {}
  for (const ch of word) count[ch] = (count[ch] || 0) + 1
  return count
}

export default function GameScreen({
  currentRound,
  totalRounds,
  score,
  scrambled,
  currentWord,
  input,
  timeLeft,
  timing,
  revealedIndices,
  paused,
  onInput,
  onLetterHint,
  onRevealWord,
  onDefinitionHint,
  onPause,
  onGoHome,
  onRestart,
  onShuffle,
  isUnlimited,
  onEndGame,
}: Props) {
  const canHint = timing !== 'timed'
  const { openPanel } = useSettings()
  const { entries: defEntries, shown: defShown, fetchDefinition } = useDefinition(currentWord)
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)
  const anagramCount = getAnagramCount(currentWord)

  const [letterHintsThisWord, setLetterHintsThisWord] = useState(0)
  useEffect(() => { setLetterHintsThisWord(0) }, [currentWord])

  function handleLetterHint() {
    if (letterHintsThisWord >= MAX_LETTER_HINTS) return
    onLetterHint()
    setLetterHintsThisWord(n => n + 1)
  }

  // Type anywhere — route keypresses to the answer input
  useEffect(() => {
    if (paused) return
    const available = letterCount(currentWord)
    const used = letterCount(input)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Backspace') {
        e.preventDefault()
        onInput(input.slice(0, -1))
        return
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        const letter = e.key.toLowerCase()
        if ((used[letter] || 0) < (available[letter] || 0)) {
          onInput((input + letter).slice(0, currentWord.length))
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [input, onInput, currentWord, paused])

  function handleDefinitionClick() {
    fetchDefinition()
    onDefinitionHint()
  }

  return (
    <div className="flex flex-col items-center gap-10 py-14 px-6 max-w-2xl mx-auto">

      <div className="w-full flex items-center justify-between text-base text-gray-400">
        <div className="flex items-center gap-4">
          <button onClick={onGoHome} className="text-gray-500 hover:text-white transition-colors text-sm">← Home</button>
          <button onClick={onRestart} className="text-gray-500 hover:text-white transition-colors text-sm">↺ Restart</button>
        </div>
        <span>Word <span className="text-[#FF4191] font-bold">{currentRound + 1}</span> / {totalRounds}</span>
        <span>Score <span className="text-[#FFF078] font-bold">{score}</span></span>
      </div>

      {timing === 'timed' && (
        <div className="w-full flex items-center gap-3">
          <div className="flex-1">
            <Timer timeLeft={timeLeft} total={TIMER_SECONDS} />
          </div>
          <button
            onClick={onPause}
            className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors"
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
      )}

      {paused ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <span className="text-3xl font-bold tracking-widest uppercase bg-gradient-to-r from-[#FF4191] to-[#FFF078] bg-clip-text text-transparent">Paused</span>
          <button
            onClick={onPause}
            className="px-10 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-lg font-semibold transition-colors"
          >
            ▶ Resume
          </button>
          <button
            onClick={() => setHowToPlayOpen(true)}
            className="text-[#FFF078]/80 hover:text-[#FFF078] text-sm transition-colors"
          >
            ? How to Play
          </button>
          <button onClick={openPanel} className="text-[var(--accent-hover)] hover:text-white text-sm transition-colors">
            ⚙ Settings
          </button>
          <button onClick={onRestart} className="text-gray-500 hover:text-white text-sm transition-colors">
            ↺ Restart
          </button>
          <button onClick={onGoHome} className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Go home
          </button>
          {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            <ScrambledWord
              scrambled={scrambled}
              input={input}
              revealedIndices={revealedIndices}
              currentWord={currentWord}
            />
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={onShuffle}
                className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                ⇄ Shuffle
              </button>
              <button
                onClick={() => onInput('')}
                className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                × Clear
              </button>
              {isUnlimited && (
                <button
                  onClick={onEndGame}
                  className="px-5 py-2 rounded-lg bg-gray-800 border border-red-900 text-sm text-red-400 hover:border-red-500 hover:text-red-300 transition-colors"
                >
                  ✕ End Game
                </button>
              )}
            </div>
          </div>

          <AnswerInput
            value={input}
            currentWord={currentWord}
            onChange={onInput}
            disabled={false}
          />

          {canHint && (
            <div className="flex flex-col items-center gap-3 w-full max-w-lg">
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={handleLetterHint}
                  disabled={letterHintsThisWord >= MAX_LETTER_HINTS}
                  className={`px-6 py-3 rounded-xl border text-base transition-colors ${
                    letterHintsThisWord >= MAX_LETTER_HINTS
                      ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-[var(--accent)] hover:text-white'
                  }`}
                >
                  💡 Letter hint ({MAX_LETTER_HINTS - letterHintsThisWord})
                </button>
                <button
                  onClick={onRevealWord}
                  className="px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-base text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors"
                >
                  👁 Reveal word
                </button>
                <button
                  onClick={handleDefinitionClick}
                  disabled={defShown}
                  className={`px-6 py-3 rounded-xl border text-base transition-colors ${
                    defShown
                      ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-default'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-[var(--accent)] hover:text-white'
                  }`}
                >
                  📖 Definition ({anagramCount})
                </button>
              </div>

              {defShown && (
                <div className="w-full rounded-xl bg-gray-900 border border-gray-800 px-5 py-4 flex flex-col gap-3">
                  {(() => {
                    const wordRevealed = revealedIndices.length >= currentWord.length
                    const allLoading = defEntries.every(e => e.loading)
                    if (allLoading) return <p className="text-sm text-gray-500 italic">Loading...</p>
                    const visible = defEntries.filter(e => e.loading || e.text !== 'Could not load definition')
                    if (visible.length === 0) return <p className="text-sm text-gray-500 italic">Could not load definitions</p>
                    return visible.map((e, i) => (
                      <div key={e.word}>
                        {(visible.length > 1 || wordRevealed) && (
                          <div className="flex items-center gap-2 mb-1">
                            {visible.length > 1 && (
                              <span className="text-xs text-gray-500 uppercase tracking-wider">Definition {i + 1}</span>
                            )}
                            {wordRevealed && (
                              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">{e.word}</span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-gray-300 italic">
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
