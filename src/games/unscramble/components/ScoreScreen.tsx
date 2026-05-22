import type { GameMode, WrongWord, HintsUsed } from '../hooks/useUnscramble'

interface Props {
  score: number
  totalRounds: number
  wrongWords: WrongWord[]
  hintsUsed: HintsUsed
  mode: GameMode
  onPlayAgain: () => void
}

export default function ScoreScreen({ score, totalRounds, wrongWords, hintsUsed, mode, onPlayAgain }: Props) {
  const playLabel = mode.play === 'daily' ? 'Daily' : mode.play === 'random' ? 'Random' : 'Unlimited'
  const timingLabel = mode.timing === 'timed' ? 'Timed' : 'Untimed'
  const modeLabel = `${playLabel} · ${timingLabel}`

  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4 max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-1">
        <span className="text-gray-400 text-sm uppercase tracking-widest">{modeLabel}</span>
        <h2 className="text-4xl font-bold text-white">
          {score} <span className="text-gray-500 text-2xl">/ {totalRounds}</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {score === totalRounds
            ? 'Perfect score!'
            : score >= totalRounds * 0.8
            ? 'Great job!'
            : score >= totalRounds * 0.5
            ? 'Not bad!'
            : 'Keep practicing!'}
        </p>
      </div>

      {(hintsUsed.letters > 0 || hintsUsed.definitions > 0) && (
        <div className="w-full rounded-xl bg-gray-900 border border-gray-800 p-4 flex justify-around text-sm">
          {hintsUsed.letters > 0 && (
            <span className="text-gray-400">
              💡 <span className="text-white font-bold">{hintsUsed.letters}</span> letter hint{hintsUsed.letters !== 1 ? 's' : ''}
            </span>
          )}
          {hintsUsed.definitions > 0 && (
            <span className="text-gray-400">
              📖 <span className="text-white font-bold">{hintsUsed.definitions}</span> definition{hintsUsed.definitions !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {wrongWords.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest">Missed words</h3>
          <div className="flex flex-col gap-1">
            {wrongWords.map((w, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 px-4 py-2 text-sm">
                <span className="text-green-400 font-bold uppercase tracking-wider">{w.word}</span>
                {w.playerInput && (
                  <span className="text-red-400 line-through">{w.playerInput}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
      >
        Play more unscramble
      </button>
    </div>
  )
}
