import { useEffect, useRef } from 'react'

interface Props {
  value:            string
  currentWord:      string
  onChange:         (value: string) => void
  disabled:         boolean
  correctFlash?:    boolean
  revealedIndices?: number[]
  cursorPos?:       number
  onCursorMove?:    (pos: number) => void
  onInputKeyDown?:  (e: React.KeyboardEvent<HTMLInputElement>) => void
  slots?:           string[]
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

function tileSize(len: number): string {
  if (len <= 4)  return '7rem'
  if (len <= 6)  return '6rem'
  if (len <= 8)  return '5rem'
  if (len <= 10) return '4rem'
  if (len <= 12) return '3.25rem'
  return '2.75rem'
}

export default function AnswerInput({
  value, currentWord, onChange, disabled, correctFlash = false, revealedIndices = [],
  cursorPos, onCursorMove, onInputKeyDown, slots,
}: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => { ref.current?.focus() }, [disabled])

  let uiCounter = 0
  const mergedSlots = Array.from({ length: currentWord.length }, (_, i) => {
    if (revealedIndices.includes(i)) return { letter: currentWord[i], isLocked: true, ui: -1 }
    const ui = uiCounter++
    const letter = slots ? (slots[ui] ?? '') : (value[ui] ?? '')
    return { letter, isLocked: false, ui }
  })

  // When cursor mode is active, highlight the exact slot at cursorPos
  const activeIdx = (() => {
    if (correctFlash || disabled) return -1
    if (cursorPos !== undefined) {
      return mergedSlots.findIndex(s => !s.isLocked && s.ui === cursorPos)
    }
    return mergedSlots.findIndex(s => !s.isLocked && !s.letter)
  })()

  const fontSize = tileSize(currentWord.length)
  const interactive = !!onCursorMove && !disabled && !correctFlash

  return (
    <div className="flex flex-col items-center gap-4" onClick={() => ref.current?.focus()}>
      <input
        ref={ref}
        type="text"
        value={value}
        maxLength={currentWord.length - revealedIndices.length}
        disabled={disabled}
        onChange={e => {
          if (!onInputKeyDown && !slots) onChange(filterToAvailable(e.target.value, currentWord, revealedIndices))
        }}
        onKeyDown={onInputKeyDown}
        className="sr-only"
        aria-label="Type your answer"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <div className="flex gap-1 justify-center items-center" style={{ flexWrap: 'nowrap' }}>
        {mergedSlots.map((slot, i) => {
          const isActive = i === activeIdx

          if (slot.letter) {
            const color = correctFlash
              ? '#86efac'
              : slot.isLocked
              ? '#fde047'
              : 'white'
            return (
              <span
                key={i}
                className={`leading-none uppercase select-none transition-all ${interactive && !slot.isLocked ? 'cursor-pointer' : ''}`}
                style={{
                  fontFamily: "'Keycapsflf', monospace",
                  color,
                  fontSize,
                  opacity: isActive ? 0.55 : 1,
                }}
                onClick={interactive && !slot.isLocked ? (e) => {
                  e.stopPropagation()
                  onCursorMove!(slot.ui)
                  ref.current?.focus()
                } : undefined}
              >
                {slot.letter}
              </span>
            )
          }

          return (
            <span
              key={i}
              className={`relative leading-none inline-block ${interactive ? 'cursor-pointer' : ''}`}
              onClick={interactive ? (e) => {
                e.stopPropagation()
                onCursorMove!(slot.ui)
                ref.current?.focus()
              } : undefined}
            >
              {/* invisible character — reserves exact glyph dimensions */}
              <span
                className="uppercase"
                style={{ fontFamily: "'Keycapsflf', monospace", fontSize, opacity: 0 }}
                aria-hidden="true"
              >
                a
              </span>
              {/* visible box overlay */}
              <span
                className={`absolute inset-[3px] rounded-xl border-2 transition-colors ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                    : 'border-white/25 bg-black/15'
                }`}
              />
            </span>
          )
        })}
      </div>
    </div>
  )
}
