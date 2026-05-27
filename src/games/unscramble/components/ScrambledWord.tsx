interface Props {
  scrambled:       string
  input:           string
  revealedIndices: number[]
  currentWord:     string
}

function getConsumedIndices(scrambled: string, input: string): number[] {
  const consumed: number[] = []
  const used = new Set<number>()
  for (const letter of input) {
    for (let i = 0; i < scrambled.length; i++) {
      if (!used.has(i) && scrambled[i] === letter) {
        consumed.push(i)
        used.add(i)
        break
      }
    }
  }
  return consumed
}

function tileSize(len: number): string {
  if (len <= 4)  return '7rem'
  if (len <= 6)  return '6rem'
  if (len <= 8)  return '5rem'
  if (len <= 10) return '4rem'
  if (len <= 12) return '3.25rem'
  return '2.75rem'
}

export default function ScrambledWord({ scrambled, input }: Props) {
  const consumedIndices = getConsumedIndices(scrambled, input)
  const fontSize = tileSize(scrambled.length)

  return (
    <div className="flex gap-1 justify-center" style={{ flexWrap: 'nowrap' }}>
      {scrambled.split('').map((letter, i) => {
        const consumed = consumedIndices.includes(i)
        return (
          <span
            key={i}
            className={`leading-none uppercase select-none transition-all duration-150 ${
              consumed ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ fontFamily: "'Keycapsflf', monospace", color: 'white', fontSize }}
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}
