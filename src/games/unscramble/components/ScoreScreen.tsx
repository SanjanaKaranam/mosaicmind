import type { GameMode, WrongWord, HintsUsed } from '../hooks/useUnscramble'

interface Props {
  score:       number
  totalRounds: number
  wrongWords:  WrongWord[]
  hintsUsed:   HintsUsed
  mode:        GameMode
  onPlayAgain: () => void
  onReplay:    () => void
}

export default function ScoreScreen({ score, totalRounds, wrongWords, hintsUsed, mode, onPlayAgain, onReplay }: Props) {
  const playLabel   = mode.play === 'daily' ? 'Daily' : mode.play === 'random' ? 'Random' : 'Unlimited'
  const timingLabel = mode.timing === 'timed' ? 'Timed' : 'Untimed'
  const modeLabel   = `${playLabel} · ${timingLabel}`

  const pct = score / totalRounds
  const message = pct === 1 ? 'Perfect score!' : pct >= 0.8 ? 'Great job!' : pct >= 0.5 ? 'Not bad!' : 'Keep practicing!'

  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4 max-w-sm mx-auto">

      {/* Score card */}
      <div className="w-full rounded-2xl bg-black/50 border border-white/15 p-8 flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest font-bold">{modeLabel}</span>
        <h2 className="text-5xl font-bold text-white mt-1">
          {score} <span className="text-white/40 text-3xl">/ {totalRounds}</span>
        </h2>
        <p className="text-[var(--accent-text)] text-sm font-semibold mt-1">{message}</p>
      </div>

      {/* Hints used */}
      {(hintsUsed.letters > 0 || hintsUsed.definitions > 0) && (
        <div className="w-full rounded-xl bg-black/40 border border-white/15 p-4 flex justify-around text-sm">
          {hintsUsed.letters > 0 && (
            <span className="text-white/60">
              💡 <span className="text-white font-bold">{hintsUsed.letters}</span> letter hint{hintsUsed.letters !== 1 ? 's' : ''}
            </span>
          )}
          {hintsUsed.definitions > 0 && (
            <span className="text-white/60">
              📖 <span className="text-white font-bold">{hintsUsed.definitions}</span> definition{hintsUsed.definitions !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Missed words */}
      {wrongWords.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-white/50 text-xs uppercase tracking-widest font-bold">Missed words</h3>
          <div className="flex flex-col gap-1">
            {wrongWords.map((w, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-black/40 border border-white/15 px-4 py-2 text-sm">
                <span className="text-green-400 font-bold uppercase tracking-wider">{w.word}</span>
                {w.playerInput && (
                  <span className="text-red-400 line-through">{w.playerInput}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        {mode.play !== 'daily' && (
          <button
            onClick={onReplay}
            className="w-full py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-colors"
          >
            ↺ Play again
          </button>
        )}
        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-xl bg-black/40 border-2 border-white/20 hover:border-white/40 text-white font-semibold transition-colors"
        >
          {mode.play === 'daily' ? 'Back to menu' : 'Play more'}
        </button>
      </div>
    </div>
  )
}
