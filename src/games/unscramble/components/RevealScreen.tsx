import { getAnagrams } from '../hooks/useDefinition'

interface Props {
  currentWord: string
  currentRound: number
  totalRounds: number
  reason: 'timeout' | 'manual'
  onNext: () => void
  onGoHome: () => void
}

export default function RevealScreen({ currentWord, currentRound, totalRounds, reason, onNext, onGoHome }: Props) {
  const anagrams = getAnagrams(currentWord)
  const isLast = currentRound + 1 >= totalRounds

  return (
    <div className="flex flex-col items-center gap-10 py-14 px-6 max-w-2xl mx-auto">
      <div className="w-full flex justify-between text-base text-gray-400">
        <span>Word <span className="text-white font-bold">{currentRound + 1}</span> / {totalRounds}</span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <span className="text-red-400 text-2xl font-semibold">
          {reason === 'timeout' ? "Time's up!" : 'Word revealed'}
        </span>

        <div className="flex flex-col items-center gap-4">
          {anagrams.map(word => (
            <div key={word} className="flex flex-col items-center gap-2">
              {anagrams.length > 1 && (
                <span className="text-xs text-gray-500 uppercase tracking-wider">{word}</span>
              )}
              <div className="flex gap-2">
                {word.split('').map((letter, i) => (
                  <div
                    key={i}
                    className="w-14 h-16 flex items-center justify-center rounded-xl bg-green-900/50 border-2 border-green-500 text-2xl font-bold text-green-300 uppercase"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="px-10 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-lg font-semibold transition-colors"
        >
          {isLast ? 'See results' : 'Next word →'}
        </button>
        <button onClick={onGoHome} className="text-gray-600 hover:text-white text-sm transition-colors">
          ← Go home
        </button>
      </div>
    </div>
  )
}
