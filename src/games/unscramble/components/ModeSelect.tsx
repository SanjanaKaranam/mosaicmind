import type { PlayMode, TimingMode, GameMode } from '../hooks/useUnscramble'
import { useState } from 'react'

interface Props {
  onStart: (mode: GameMode) => void
}

const playOptions: { value: PlayMode; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Same 17 words for everyone today' },
  { value: 'random', label: 'Random', description: 'New set of words every game' },
]

const timingOptions: { value: TimingMode; label: string; description: string }[] = [
  { value: 'timed', label: 'Timed', description: '30 seconds per word' },
  { value: 'untimed', label: 'Untimed', description: 'No timer, 1 attempt per word' },
  { value: 'unlimited', label: 'Unlimited', description: 'No timer, unlimited attempts' },
]

export default function ModeSelect({ onStart }: Props) {
  const [play, setPlay] = useState<PlayMode>('daily')
  const [timing, setTiming] = useState<TimingMode>('timed')

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <h1 className="text-4xl font-bold text-white tracking-wide">UNSCRAMBLE</h1>
      <p className="text-gray-400 text-center max-w-sm">
        Unscramble 17 words — starting easy, getting harder.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Mode</p>
        {playOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setPlay(opt.value)}
            className={`w-full py-3 px-4 rounded-xl border text-left transition-colors ${
              play === opt.value
                ? 'border-purple-500 bg-purple-500/10 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'
            }`}
          >
            <span className="font-semibold">{opt.label}</span>
            <span className="text-sm text-gray-400 ml-2">— {opt.description}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Difficulty</p>
        {timingOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setTiming(opt.value)}
            className={`w-full py-3 px-4 rounded-xl border text-left transition-colors ${
              timing === opt.value
                ? 'border-purple-500 bg-purple-500/10 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'
            }`}
          >
            <span className="font-semibold">{opt.label}</span>
            <span className="text-sm text-gray-400 ml-2">— {opt.description}</span>
          </button>
        ))}
        {timing === 'unlimited' && (
          <p className="text-yellow-500/80 text-sm text-center">
            Progress is not saved in unlimited mode.
          </p>
        )}
      </div>

      <button
        onClick={() => onStart({ play, timing })}
        className="w-full max-w-sm py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition-colors"
      >
        Start Game
      </button>
    </div>
  )
}
