import { useEffect, useRef } from 'react'

interface Props {
  value: string
  currentWord: string
  onChange: (value: string) => void
  disabled: boolean
  correctFlash?: boolean
}

function letterCount(word: string): Record<string, number> {
  const count: Record<string, number> = {}
  for (const ch of word) count[ch] = (count[ch] || 0) + 1
  return count
}

function filterToAvailable(raw: string, currentWord: string): string {
  const available = letterCount(currentWord.toLowerCase())
  const used: Record<string, number> = {}
  let result = ''
  for (const ch of raw.toLowerCase().replace(/[^a-z]/g, '')) {
    used[ch] = (used[ch] || 0) + 1
    if (used[ch] <= (available[ch] || 0)) result += ch
  }
  return result.slice(0, currentWord.length)
}

export default function AnswerInput({ value, currentWord, onChange, disabled, correctFlash = false }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [disabled])

  return (
    <div className="flex flex-col items-center gap-4" onClick={() => ref.current?.focus()}>
      <input
        ref={ref}
        type="text"
        value={value}
        maxLength={currentWord.length}
        disabled={disabled}
        onChange={e => onChange(filterToAvailable(e.target.value, currentWord))}
        className="sr-only"
        aria-label="Type your answer"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <div className="flex gap-3 flex-wrap justify-center">
        {Array.from({ length: currentWord.length }).map((_, i) => {
          const letter = value[i]
          const isActive = i === value.length && !disabled
          return (
            <div
              key={i}
              className={`w-16 h-20 flex items-center justify-center rounded-xl border-2 text-3xl font-bold uppercase transition-colors select-none ${
                correctFlash
                  ? 'bg-green-900 border-green-400 text-green-300'
                  : letter
                  ? 'bg-gray-700 border-[var(--accent)] text-white'
                  : isActive
                  ? 'bg-gray-900 border-[var(--accent)] border-dashed text-transparent'
                  : 'bg-gray-900 border-gray-700 text-transparent'
              }`}
            >
              {letter ?? ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}
