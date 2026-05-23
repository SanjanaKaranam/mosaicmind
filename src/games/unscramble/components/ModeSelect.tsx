import type { PlayMode, TimingMode, GameMode } from '../hooks/useUnscramble'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import HowToPlayModal from './HowToPlayModal'

interface Props {
  onStart: (mode: GameMode) => void
}

const playOptions: { value: PlayMode; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Same 17 words for everyone today' },
  { value: 'random', label: 'Random', description: 'New set of words every game' },
  { value: 'unlimited', label: 'Unlimited', description: 'Play as many words as you want' },
]

const timingOptions: { value: TimingMode; label: string; description: string }[] = [
  { value: 'timed', label: 'Timed', description: '30 seconds per word' },
  { value: 'untimed', label: 'Untimed', description: 'No timer, unlimited attempts' },
]

function getDailyDone(): Record<string, boolean> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const raw = localStorage.getItem(`unscramble_daily_done_${today}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function hasInProgress(play: PlayMode, timing: TimingMode): boolean {
  if (play === 'unlimited') return false
  try {
    const date = new Date().toISOString().slice(0, 10)
    const key = play === 'daily'
      ? `unscramble_daily_${timing}_${date}`
      : `unscramble_random_${timing}`
    const raw = localStorage.getItem(key)
    if (!raw) return false
    const data = JSON.parse(raw)
    return data?.words?.length > 0 && data.currentRound < data.words.length
  } catch {
    return false
  }
}

function timeUntilMidnightUTC(): string {
  const now = new Date()
  const midnight = new Date()
  midnight.setUTCHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function ModeSelect({ onStart }: Props) {
  const [play, setPlay] = useState<PlayMode>('daily')
  const [timing, setTiming] = useState<TimingMode>('timed')
  const [wordCountInput, setWordCountInput] = useState('')
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  const dailyDone = getDailyDone()
  const dailyAnyDone = !!dailyDone['timed'] || !!dailyDone['untimed']
  const isLocked = play === 'daily' && dailyAnyDone
  const isResumable = hasInProgress(play, timing)

  const MAX_UNLIMITED_WORDS = 5584
  const wordCount = play === 'unlimited' && wordCountInput !== ''
    ? Math.min(MAX_UNLIMITED_WORDS, Math.max(1, parseInt(wordCountInput, 10)))
    : undefined

  function handleStart() {
    if (isLocked) return
    onStart({ play, timing, wordCount })
  }

  function handleNewGame() {
    try {
      localStorage.removeItem(`unscramble_random_${timing}`)
      localStorage.removeItem('unscramble_last_key')
    } catch {}
    onStart({ play, timing })
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors">
          ← All Games
        </Link>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-[#FF4191] to-[#FFF078] bg-clip-text text-transparent">CRYPTEXT</h1>
        <p className="text-[#FFF078]/70 text-center max-w-sm">
          Unscramble 17 words — starting easy, getting harder.
        </p>
        <button
          onClick={() => setHowToPlayOpen(true)}
          className="mt-1 text-sm text-[var(--accent-text)] hover:text-white border border-gray-700 hover:border-[var(--accent)] rounded-lg px-4 py-1.5 transition-colors"
        >
          ? How to Play
        </button>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Mode</p>
        {playOptions.map(opt => {
          const anyInProgress = opt.value !== 'unlimited' && (
            hasInProgress(opt.value, 'timed') || hasInProgress(opt.value, 'untimed')
          )
          return (
            <button
              key={opt.value}
              onClick={() => setPlay(opt.value)}
              className={`w-full py-3 px-4 rounded-xl border text-left transition-colors ${
                play === opt.value
                  ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'
              }`}
            >
              <span className="font-semibold">{opt.label}</span>
              <span className="text-sm text-gray-400 ml-2">— {opt.description}</span>
              {anyInProgress && (
                <span className="ml-2 text-xs text-yellow-500 font-medium">● in progress</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Difficulty</p>
        {timingOptions.map(opt => {
          const thisOneDone = play === 'daily' && !!dailyDone[opt.value]
          const lockedOut = play === 'daily' && dailyAnyDone && !thisOneDone
          const disabled = thisOneDone || lockedOut
          const inProgress = hasInProgress(play, opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => !disabled && setTiming(opt.value)}
              disabled={disabled}
              className={`w-full py-3 px-4 rounded-xl border text-left transition-colors ${
                disabled
                  ? 'border-gray-800 bg-gray-900/50 text-gray-600 cursor-not-allowed'
                  : timing === opt.value
                  ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'
              }`}
            >
              <span className="font-semibold">{opt.label}</span>
              {thisOneDone
                ? <span className="text-sm text-green-600 ml-2">✓ Completed — resets in {timeUntilMidnightUTC()}</span>
                : lockedOut
                ? <span className="text-sm text-gray-600 ml-2">— played another version today</span>
                : inProgress
                ? <span className="text-sm text-yellow-500 ml-2">● in progress — {opt.description}</span>
                : <span className="text-sm text-gray-400 ml-2">— {opt.description}</span>
              }
            </button>
          )
        })}
      </div>

      {play === 'unlimited' && (
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <p className="text-gray-400 text-sm uppercase tracking-widest">How many words?</p>
          <input
            type="number"
            min={1}
            placeholder={`Default: 200 (max ${MAX_UNLIMITED_WORDS})`}
            value={wordCountInput}
            onChange={e => setWordCountInput(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full py-3 px-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      )}

      {play === 'random' && isResumable ? (
        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={handleStart}
            className="flex-1 py-4 rounded-xl font-bold text-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors"
          >
            ▶ Resume Game
          </button>
          <button
            onClick={handleNewGame}
            className="px-5 py-4 rounded-xl font-bold text-lg bg-gray-800 border border-gray-700 text-gray-300 hover:border-[var(--accent)] hover:text-white transition-colors"
          >
            ↺ New Game
          </button>
        </div>
      ) : (
        <button
          onClick={handleStart}
          disabled={isLocked}
          className={`w-full max-w-sm py-4 rounded-xl font-bold text-lg transition-colors ${
            isLocked
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
          }`}
        >
          {isLocked
            ? `Come back in ${timeUntilMidnightUTC()}`
            : play === 'unlimited'
            ? 'Play Unlimited'
            : isResumable
            ? '▶ Resume Game'
            : 'Start Game'}
        </button>
      )}
      {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}
    </div>
  )
}
