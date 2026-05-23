import { useEffect, useRef } from 'react'

interface Props {
  value: string
  currentWord: string
  onChange: (value: string) => void
  disabled: boolean
  correctFlash?: boolean
  revealedIndices?: number[]
}

function letterCount(word: string): Record<string, number> {
  const count: Record<string, number> = {}
  for (const ch of word) count[ch] = (count[ch] || 0) + 1
  return count
}

function filterToAvailable(raw: string, currentWord: string, locked: number[]): string {
  const available = letterCount(currentWord)
  for (const i of locked) {
    const ch = currentWord[i]
    if (available[ch]) available[ch]--
  }
  const used: Record<string, number> = {}
  let result = ''
  const maxLen = currentWord.length - locked.length
  for (const ch of raw.toLowerCase().replace(/[^a-z]/g, '')) {
    used[ch] = (used[ch] || 0) + 1
    if (used[ch] <= (available[ch] || 0)) result += ch
  }
  return result.slice(0, maxLen)
}

export default function AnswerInput({
  value,
  currentWord,
  onChange,
  disabled,
  correctFlash = false,
  revealedIndices = [],
}: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [disabled])

  // Build merged display slots: locked positions show hint letter, others show user chars
  const mergedSlots = Array.from({ length: currentWord.length }, (_, i) => {
    if (revealedIndices.includes(i)) return { letter: currentWord[i], isLocked: true }
    let ui = 0
    for (let j = 0; j < i; j++) if (!revealedIndices.includes(j)) ui++
    return { letter: value[ui] ?? '', isLocked: false }
  })

  // Active tile = first non-locked, non-filled position
  const activeIdx = correctFlash || disabled
    ? -1
    : mergedSlots.findIndex(s => !s.isLocked && !s.letter)

  return (
    <div className="flex flex-col items-center gap-4" onClick={() => ref.current?.focus()}>
      <input
        ref={ref}
        type="text"
        value={value}
        maxLength={currentWord.length - revealedIndices.length}
        disabled={disabled}
        onChange={e => onChange(filterToAvailable(e.target.value, currentWord, revealedIndices))}
        className="sr-only"
        aria-label="Type your answer"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <div className="flex gap-3 flex-wrap justify-center">
        {mergedSlots.map((slot, i) => {
          const isActive = i === activeIdx
          return (
            <div
              key={i}
              className={`w-16 h-20 flex items-center justify-center rounded-xl border-2 text-3xl font-bold uppercase transition-colors select-none ${
                correctFlash
                  ? 'bg-green-900 border-green-400 text-green-300'
                  : slot.isLocked
                  ? 'border-yellow-400 text-yellow-200'
                  : slot.letter
                  ? 'bg-gray-700 border-[var(--accent)] text-white'
                  : isActive
                  ? 'bg-gray-900 border-[var(--accent)] border-dashed text-transparent'
                  : 'bg-gray-900 border-gray-700 text-transparent'
              }`}
              style={slot.isLocked && !correctFlash ? { backgroundColor: 'rgba(234,179,8,0.15)' } : {}}
            >
              {slot.letter || ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}
