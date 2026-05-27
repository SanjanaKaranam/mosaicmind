import type { PlayMode, TimingMode, GameMode } from '../hooks/useUnscramble'
import { useState } from 'react'
import HowToPlayModal from './HowToPlayModal'

interface Props {
  onStart: (mode: GameMode) => void
}

const playOptions: { value: PlayMode; label: string; description: string }[] = [
  { value: 'daily',     label: 'Daily',     description: 'Same 17 words for everyone today' },
  { value: 'random',    label: 'Random',    description: 'New set of words every game' },
  { value: 'unlimited', label: 'Unlimited', description: 'Play as many words as you want' },
]

const timingOptions: { value: TimingMode; label: string; description: string }[] = [
  { value: 'timed',   label: 'Timed',   description: '30 seconds per word' },
  { value: 'untimed', label: 'Untimed', description: 'No timer, unlimited attempts' },
]

interface DailyResult { score: number; total: number }

function getDailyDone(): Record<string, DailyResult | boolean> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const raw = localStorage.getItem(`unscramble_daily_done_${today}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function getDailyScore(done: Record<string, DailyResult | boolean>): DailyResult | null {
  for (const val of Object.values(done)) {
    if (val && typeof val === 'object') return val
  }
  return null
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
  const [play, setPlay]           = useState<PlayMode>('daily')
  const [timing, setTiming]       = useState<TimingMode>('timed')
  const [wordCountInput, setWordCountInput] = useState('')
  const [howToPlayOpen, setHowToPlayOpen]   = useState(false)

  const dailyDone    = getDailyDone()
  const dailyAnyDone = !!dailyDone['timed'] || !!dailyDone['untimed']
  const dailyScore   = getDailyScore(dailyDone)
  const isLocked     = play === 'daily' && dailyAnyDone
  const isResumable  = hasInProgress(play, timing)

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
    <div className="flex flex-col items-center gap-6 py-10 px-4">
      {/* How to play */}
      <button
        onClick={() => setHowToPlayOpen(true)}
        className="text-sm font-bold uppercase tracking-wide px-4 py-2 rounded border-2 border-black/25 hover:border-black/50 transition-colors"
        style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
      >
        ? How to Play
      </button>

      {/* Mode */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Mode</p>
        {playOptions.map(opt => {
          const anyInProgress = opt.value !== 'unlimited' && (
            hasInProgress(opt.value, 'timed') || hasInProgress(opt.value, 'untimed')
          )
          return (
            <button
              key={opt.value}
              onClick={() => setPlay(opt.value)}
              className={`w-full py-4 px-5 rounded-xl text-left transition-all text-base flex items-center justify-between gap-3 ${
                play === opt.value
                  ? 'border-4 border-rose-500 shadow-md'
                  : 'border-2 border-black/15 opacity-70 hover:opacity-100 hover:border-black/35'
              }`}
              style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
            >
              <span>
                <span className="font-bold">{opt.label}</span>
                <span className="ml-2 opacity-60">— {opt.description}</span>
                {anyInProgress && (
                  <span className="ml-2 text-sm font-medium text-orange-600">● in progress</span>
                )}
              </span>
              {opt.value === 'daily' && dailyScore && (
                <span className="font-bold text-lg shrink-0">
                  {dailyScore.score} <span className="opacity-50 font-normal text-sm">/ {dailyScore.total}</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Difficulty</p>
        {timingOptions.map(opt => {
          const thisOneDone = play === 'daily' && !!dailyDone[opt.value]
          const lockedOut   = play === 'daily' && dailyAnyDone && !thisOneDone
          const disabled    = thisOneDone || lockedOut
          const inProgress  = hasInProgress(play, opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => !disabled && setTiming(opt.value)}
              disabled={disabled}
              className={`w-full py-4 px-5 rounded-xl text-left transition-all text-base ${
                disabled
                  ? 'border-2 border-black/10 opacity-40 cursor-not-allowed'
                  : timing === opt.value
                  ? 'border-4 border-rose-500 shadow-md'
                  : 'border-2 border-black/15 opacity-70 hover:opacity-100 hover:border-black/35'
              }`}
              style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
            >
              <span className="font-bold">{opt.label}</span>
              {thisOneDone
                ? <span className="ml-2 text-green-700">✓ Completed — resets in {timeUntilMidnightUTC()}</span>
                : lockedOut
                ? <span className="ml-2 opacity-40">— played another version today</span>
                : inProgress
                ? <span className="ml-2 text-orange-600 font-medium">● in progress — {opt.description}</span>
                : <span className="ml-2 opacity-60">— {opt.description}</span>
              }
            </button>
          )
        })}
      </div>

      {/* Unlimited word count */}
      {play === 'unlimited' && (
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <p className="text-white/60 text-xs uppercase tracking-widest font-bold">How many words?</p>
          <input
            type="number"
            min={1}
            placeholder={`Default: 200 (max ${MAX_UNLIMITED_WORDS})`}
            value={wordCountInput}
            onChange={e => setWordCountInput(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full py-3 px-4 rounded-xl border-2 border-black/20 focus:outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
          />
        </div>
      )}

      {/* Start / Resume */}
      {play === 'random' && isResumable ? (
        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={handleStart}
            className="flex-1 py-4 rounded-xl font-bold text-lg transition-all border-4 border-black/50 shadow-md hover:shadow-lg hover:opacity-90"
            style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
          >
            ▶ Resume Game
          </button>
          <button
            onClick={handleNewGame}
            className="px-5 py-4 rounded-xl font-bold text-lg border-2 border-black/20 hover:border-black/50 transition-colors"
            style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
          >
            ↺ New
          </button>
        </div>
      ) : (
        <button
          onClick={handleStart}
          disabled={isLocked}
          className={`w-full max-w-sm py-4 rounded-xl font-bold text-lg transition-all ${
            isLocked
              ? 'opacity-40 cursor-not-allowed border-2 border-black/10'
              : 'border-4 border-black/50 shadow-md hover:shadow-lg hover:opacity-90'
          }`}
          style={{ backgroundColor: 'var(--home-banner-bg)', color: 'var(--home-banner-text)' }}
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
