interface Props {
  onClose: () => void
}

export default function HowToPlayModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-wide uppercase">How to Play</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-gray-300">
          <p>
            Unscramble <span className="text-white font-semibold">17 words</span>, starting easy and getting harder.
            Rearrange the shuffled letters to form the correct word.
          </p>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Example</p>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-800 border border-gray-700">
              <div className="flex gap-2 justify-center flex-wrap">
                {['E', 'Z', 'E', 'E', 'R', 'B'].map((letter, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-600 bg-gray-700 text-white font-bold text-sm"
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <p className="text-center text-gray-400 text-xs">→ answer: <span className="text-[var(--accent-text)] font-semibold">BREEZE</span></p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Modes</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <span className="text-white font-semibold min-w-20">Timed</span>
                <span className="text-gray-400">30 seconds per word — run out of time and the word is revealed</span>
              </div>
              <div className="flex gap-2">
                <span className="text-white font-semibold min-w-20">Untimed</span>
                <span className="text-gray-400">Unlimited time and attempts per word</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Hints (untimed only)</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <span>💡</span>
                <span><span className="text-white font-semibold">Letter hint</span> — reveals one letter in the correct position (up to 3 per word)</span>
              </div>
              <div className="flex gap-2">
                <span>👁</span>
                <span><span className="text-white font-semibold">Reveal word</span> — skip the word and see the answer</span>
              </div>
              <div className="flex gap-2">
                <span>📖</span>
                <span><span className="text-white font-semibold">Definition</span> — shows a dictionary definition</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Scoring</p>
            <p className="text-gray-400">1 point per word you unscramble correctly. Revealing a word scores 0 for that word — hints and definitions don't affect your score.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}
