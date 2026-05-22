import { Link } from 'react-router-dom'

interface GameTile {
  title: string
  description: string
  path: string | null
  emoji: string
}

const games: GameTile[] = [
  {
    title: 'CrypText',
    description: 'Unscramble 17 words — starting easy, getting harder.',
    path: '/unscramble',
    emoji: '🔀',
  },
  {
    title: 'Wordle',
    description: 'Guess the hidden 5-letter word in 6 tries.',
    path: null,
    emoji: '🟩',
  },
  {
    title: 'Guess The Word',
    description: 'Figure out the mystery word from clues.',
    path: null,
    emoji: '💬',
  },
  {
    title: 'Word Connect',
    description: 'Find words hidden in a grid of letters.',
    path: null,
    emoji: '🔗',
  },
  {
    title: 'Mini Crossword',
    description: 'A quick 5×5 crossword puzzle.',
    path: null,
    emoji: '✏️',
  },
  {
    title: 'Crossword',
    description: 'Fill in the full classic crossword puzzle.',
    path: null,
    emoji: '📰',
  },
  {
    title: 'Mini Sudoku',
    description: 'A quick 6×6 number puzzle.',
    path: null,
    emoji: '🔢',
  },
  {
    title: 'Sudoku',
    description: 'Fill in the classic 9×9 number grid.',
    path: null,
    emoji: '🧩',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-white tracking-tight">Mosaic Mind</h1>
          <p className="text-gray-400 text-lg">A collection of word puzzles. New games coming soon.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map(game => {
            const content = (
              <div className={`flex flex-col gap-3 p-6 rounded-2xl border transition-colors h-full ${
                game.path
                  ? 'bg-gray-900 border-gray-800 hover:border-purple-500 cursor-pointer'
                  : 'bg-gray-900/50 border-gray-800/50 cursor-not-allowed'
              }`}>
                <span className="text-3xl">{game.emoji}</span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-lg font-bold ${game.path ? 'text-white' : 'text-gray-500'}`}>
                      {game.title}
                    </h2>
                    {!game.path && (
                      <span className="text-xs text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${game.path ? 'text-gray-400' : 'text-gray-600'}`}>
                    {game.description}
                  </p>
                </div>
              </div>
            )

            return game.path
              ? <Link key={game.title} to={game.path} className="h-full">{content}</Link>
              : <div key={game.title}>{content}</div>
          })}
        </div>
      </div>
    </div>
  )
}
