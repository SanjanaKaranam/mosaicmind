interface Props {
  scrambled: string
  input: string
  revealedIndices: number[]
  currentWord: string
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

export default function ScrambledWord({ scrambled, input, revealedIndices, currentWord }: Props) {
  const consumedIndices = getConsumedIndices(scrambled, input)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3 flex-wrap justify-center">
        {scrambled.split('').map((letter, i) => {
          const consumed = consumedIndices.includes(i)
          return (
            <div
              key={i}
              className={`w-16 h-20 flex items-center justify-center rounded-xl border-2 text-3xl font-bold uppercase transition-all duration-150 ${
                consumed
                  ? 'bg-gray-900 border-gray-800 text-gray-800'
                  : 'bg-gray-800 border-gray-700 text-white'
              }`}
            >
              {consumed ? '' : letter}
            </div>
          )
        })}
      </div>

      {revealedIndices.length > 0 && (
        <div className="flex gap-3 flex-wrap justify-center">
          {currentWord.split('').map((letter, i) => (
            <div
              key={i}
              className={`w-16 h-20 flex items-center justify-center rounded-xl border-2 text-3xl font-bold uppercase transition-colors ${
                revealedIndices.includes(i)
                  ? 'bg-purple-900/50 border-purple-500 text-purple-300'
                  : 'bg-transparent border-gray-700 text-transparent'
              }`}
            >
              {revealedIndices.includes(i) ? letter : '_'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
