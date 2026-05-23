import { Link } from 'react-router-dom'

interface GameTile {
  title: string
  description: string
  path: string | null
  emoji: string
}

const games: GameTile[] = [
  { title: 'CrypText',       description: 'Unscramble words against the clock. How many can you get?', path: '/unscramble', emoji: '🔀' },
  { title: 'Wordle',         description: 'Guess the hidden 5-letter word in 6 tries.',                path: null,          emoji: '🟩' },
  { title: 'Guess The Word', description: 'Figure out the mystery word from clues.',                   path: null,          emoji: '💬' },
  { title: 'Word Connect',   description: 'Find words hidden in a grid of letters.',                   path: null,          emoji: '🔗' },
  { title: 'Mini Crossword', description: 'A quick 5×5 crossword puzzle.',                             path: null,          emoji: '✏️' },
  { title: 'Crossword',      description: 'Fill in the full classic crossword puzzle.',                 path: null,          emoji: '📰' },
  { title: 'Mini Sudoku',    description: 'A quick 6×6 number puzzle.',                                path: null,          emoji: '🔢' },
  { title: 'Sudoku',         description: 'Fill in the classic 9×9 number grid.',                      path: null,          emoji: '🧩' },
]

const CARD_COLOR: Record<string, string> = {
  'CrypText':       '#E90074',
  'Wordle':         '#EAB308',
  'Guess The Word': '#A855F7',
  'Word Connect':   '#06B6D4',
  'Mini Crossword': '#F97316',
  'Crossword':      '#16A34A',
  'Mini Sudoku':    '#EF4444',
  'Sudoku':         '#3B82F6',
}

const fredoka = { fontFamily: "'Fredoka', 'Poppins', sans-serif", fontWeight: 700 }
const pixel   = { fontFamily: "'Press Start 2P', monospace" }
const hatch   = { backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 6px)' }

function Brackets({ size = 10, color = 'rgba(0,0,0,0.45)' }: { size?: number; color?: string }) {
  const b: React.CSSProperties = { position: 'absolute', width: size, height: size, borderColor: color, borderStyle: 'solid' }
  return (
    <>
      <span style={{ ...b, top: 5, left: 5,   borderWidth: '2px 0 0 2px' }} />
      <span style={{ ...b, top: 5, right: 5,  borderWidth: '2px 2px 0 0' }} />
      <span style={{ ...b, bottom: 5, left: 5,  borderWidth: '0 0 2px 2px' }} />
      <span style={{ ...b, bottom: 5, right: 5, borderWidth: '0 2px 2px 0' }} />
    </>
  )
}

export default function Home() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        backgroundColor: '#2D6623',
        backgroundImage: [
          'linear-gradient(rgba(160,255,60,0.14) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(160,255,60,0.14) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '44px 44px',
      }}
    >

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-14 pb-10">

        {/* Floating neon shapes — match the grid BG vibe */}
        <span className="absolute top-6  right-12 text-[#E90074]/50  text-2xl select-none pointer-events-none" aria-hidden="true">▲</span>
        <span className="absolute top-20 right-5  text-[#FFF078]/35  text-sm  select-none pointer-events-none" aria-hidden="true">+</span>
        <span className="absolute top-10 left-2   text-[#A855F7]/40  text-lg  select-none pointer-events-none" aria-hidden="true">×</span>
        <span className="absolute bottom-6 right-20 text-[#06B6D4]/40 text-xl  select-none pointer-events-none" aria-hidden="true">◆</span>
        <span className="absolute bottom-12 left-6  text-[#E90074]/30 text-base select-none pointer-events-none" aria-hidden="true">▲</span>
        <span className="absolute top-32 right-32  text-[#FFF078]/25 text-xs  select-none pointer-events-none" aria-hidden="true">×</span>

        {/* Logo — two solid color blocks */}
        <div className="flex items-stretch w-fit" style={{ boxShadow: '5px 5px 0 #000' }}>
          <div className="relative bg-[#E90074] border-4 border-black px-6 py-4 overflow-hidden">
            <Brackets size={8} />
            <div className="absolute inset-y-0 right-0 w-6" style={hatch} />
            <span className="relative text-black leading-none" style={{ ...fredoka, fontSize: 'clamp(2rem, 8vw, 3.2rem)' }}>
              MOSAIC
            </span>
          </div>
          <div className="relative bg-[#FFF078] border-4 border-l-0 border-black px-6 py-4 overflow-hidden">
            <Brackets size={8} />
            <div className="absolute inset-y-0 left-0 w-6" style={hatch} />
            <span className="relative text-black leading-none" style={{ ...fredoka, fontSize: 'clamp(2rem, 8vw, 3.2rem)' }}>
              MIND
            </span>
          </div>
        </div>

        <p className="mt-5 text-[#E90074]/70 text-[9px] uppercase tracking-widest leading-relaxed" style={pixel}>
          Word games &amp; puzzles
        </p>
      </section>

      {/* ── Divider band ──────────────────────────────────────────────── */}
      <div className="relative bg-[#E90074] border-y-4 border-black px-6 py-3 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-16" style={hatch} />
        <p className="text-center text-black font-black uppercase tracking-[0.3em] text-sm" style={fredoka}>
          ↓ &nbsp; PICK A GAME &nbsp; ↓
        </p>
      </div>

      {/* ── Game grid ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">

        {/* Available card */}
        {games.filter(g => g.path).map(game => {
          const c = CARD_COLOR[game.title]
          return (
            <Link key={game.title} to={game.path!} className="group block">
              <div
                className="relative border-4 border-black overflow-hidden transition-all duration-100 group-hover:-translate-y-1"
                style={{ backgroundColor: c, boxShadow: '6px 6px 0 #000' }}
              >
                {/* Top hatch bar */}
                <div className="h-7 w-full border-b-4 border-black" style={hatch} />

                <div className="relative flex items-center gap-6 px-7 py-5">
                  <Brackets size={11} />
                  {/* Right-edge hatch strip */}
                  <div className="absolute inset-y-0 right-0 w-14 border-l-4 border-black" style={hatch} />

                  <span className="text-5xl shrink-0 relative z-10">{game.emoji}</span>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-black/55 text-[8px] uppercase mb-1.5" style={pixel}>Now Playing</p>
                    <h2 className="text-2xl text-black uppercase" style={fredoka}>{game.title}</h2>
                    <p className="text-black/65 text-sm mt-1">{game.description}</p>
                  </div>
                  <span
                    className="text-black text-lg shrink-0 mr-16 group-hover:translate-x-1 transition-transform relative z-10"
                    style={fredoka}
                  >
                    PLAY →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}

        {/* Coming soon — 4-col grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {games.filter(g => !g.path).map(game => {
            const c = CARD_COLOR[game.title]
            return (
              <div
                key={game.title}
                className="relative flex flex-col gap-2 border-4 border-black overflow-hidden cursor-not-allowed"
                style={{ backgroundColor: c, boxShadow: '4px 4px 0 #000' }}
              >
                {/* Top hatch bar */}
                <div className="h-5 w-full border-b-4 border-black shrink-0" style={hatch} />

                <div className="relative flex flex-col gap-2 px-4 pb-4">
                  <Brackets size={7} />
                  <span className="text-2xl">{game.emoji}</span>
                  <div>
                    <h2 className="text-sm text-black uppercase leading-tight" style={fredoka}>
                      {game.title}
                    </h2>
                    <span className="block text-[7px] text-black/60 uppercase mt-1" style={pixel}>
                      Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-black/55 leading-snug">{game.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="relative bg-[#FFF078] border-t-4 border-black px-6 py-4 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-16" style={hatch} />
        <p className="text-center text-black text-[9px] uppercase tracking-widest" style={pixel}>
          ✦ &nbsp; More games coming soon &nbsp; ✦
        </p>
      </div>

    </div>
  )
}
