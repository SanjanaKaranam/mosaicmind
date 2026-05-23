import { useState, useEffect } from 'react'

const REVEAL_SECONDS = 3

interface Props {
  currentWord: string
  currentRound: number
  totalRounds: number
  reason: 'timeout' | 'manual'
  onGoHome: () => void
}

export default function RevealScreen({ currentWord, currentRound, totalRounds, reason, onGoHome }: Props) {
  const [countdown, setCountdown] = useState(REVEAL_SECONDS)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  return (
    <div className="flex flex-col items-center gap-10 py-14 px-6 max-w-2xl mx-auto">
      <div className="w-full flex justify-between text-base text-gray-400">
        <span>Word <span className="text-white font-bold">{currentRound + 1}</span> / {totalRounds}</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-red-400 text-2xl font-semibold">
          {reason === 'timeout' ? "Time's up!" : 'Word revealed'}
        </span>
        <span className="text-gray-400 text-sm">The word was</span>
        <div className="flex gap-2">
          {currentWord.split('').map((letter, i) => (
            <div
              key={i}
              className="w-16 h-20 flex items-center justify-center rounded-xl bg-green-900/50 border-2 border-green-500 text-3xl font-bold text-green-300 uppercase"
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-lg">
        Next word in <span className="text-white font-bold">{countdown}</span>...
      </p>

      <button
        onClick={onGoHome}
        className="text-gray-600 hover:text-white text-sm transition-colors"
      >
        ← Go home
      </button>
    </div>
  )
}
