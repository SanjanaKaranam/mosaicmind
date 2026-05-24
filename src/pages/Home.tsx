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

const ROTATIONS: Record<string, string> = {
  'CrypText':       'rotate(-1deg)',
  'Wordle':         'rotate(-2.8deg)',
  'Guess The Word': 'rotate(2.1deg)',
  'Word Connect':   'rotate(-1.4deg)',
  'Mini Crossword': 'rotate(3deg)',
  'Crossword':      'rotate(-2deg)',
  'Mini Sudoku':    'rotate(1.6deg)',
  'Sudoku':         'rotate(-2.4deg)',
}

// ── Tile mosaic ───────────────────────────────────────────────────────────────

const TILE_PALETTE = [
  '#1E40AF', '#9333EA', '#991B1B', '#D97706', '#166534',
  '#2563EB', '#0D9488', '#C2410C', '#15803D', '#1D4ED8',
  '#B91C1C', '#CA8A04', '#065F46', '#3B82F6', '#EA580C',
  '#EAB308', '#7C3AED', '#0891B2', '#DC2626', '#BE185D',
  '#1E3A8A', '#F59E0B', '#7F1D1D', '#92400E', '#14532D',
]

const enc = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const PATTERNS = [
  null, null,   // ~22% solid tiles
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><polygon points="26,5 47,26 26,47 5,26" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" fill="none"/><circle cx="26" cy="26" r="4" fill="rgba(255,255,255,0.45)"/></svg>`),
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><circle cx="26" cy="11" r="8" fill="rgba(255,255,255,0.38)"/><circle cx="41" cy="26" r="8" fill="rgba(255,255,255,0.38)"/><circle cx="26" cy="41" r="8" fill="rgba(255,255,255,0.38)"/><circle cx="11" cy="26" r="8" fill="rgba(255,255,255,0.38)"/><circle cx="26" cy="26" r="5" fill="rgba(255,255,255,0.55)"/></svg>`),
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><rect x="23" y="5" width="6" height="42" rx="2" fill="rgba(255,255,255,0.38)"/><rect x="5" y="23" width="42" height="6" rx="2" fill="rgba(255,255,255,0.38)"/><circle cx="26" cy="26" r="5" fill="rgba(255,255,255,0.5)"/></svg>`),
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><circle cx="26" cy="26" r="20" stroke="rgba(255,255,255,0.42)" stroke-width="2.5" fill="none"/><circle cx="26" cy="26" r="11" stroke="rgba(255,255,255,0.35)" stroke-width="2" fill="none"/><circle cx="26" cy="26" r="4" fill="rgba(255,255,255,0.45)"/></svg>`),
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><line x1="26" y1="4" x2="26" y2="48" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/><line x1="4" y1="26" x2="48" y2="26" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/><line x1="9" y1="9" x2="43" y2="43" stroke="rgba(255,255,255,0.28)" stroke-width="2"/><line x1="43" y1="9" x2="9" y2="43" stroke="rgba(255,255,255,0.28)" stroke-width="2"/><circle cx="26" cy="26" r="4" fill="rgba(255,255,255,0.5)"/></svg>`),
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><ellipse cx="26" cy="13" rx="5" ry="9" fill="rgba(255,255,255,0.4)"/><ellipse cx="39" cy="26" rx="9" ry="5" fill="rgba(255,255,255,0.4)"/><ellipse cx="26" cy="39" rx="5" ry="9" fill="rgba(255,255,255,0.4)"/><ellipse cx="13" cy="26" rx="9" ry="5" fill="rgba(255,255,255,0.4)"/><circle cx="26" cy="26" r="4" fill="rgba(255,255,255,0.5)"/></svg>`),
  enc(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><path d="M26 6 L30 20 L44 16 L34 26 L44 36 L30 32 L26 46 L22 32 L8 36 L18 26 L8 16 L22 20 Z" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="rgba(255,255,255,0.18)"/></svg>`),
]

function tileColor(i: number) {
  return TILE_PALETTE[(i * 7 + Math.floor(i / 25) * 11) % TILE_PALETTE.length]
}
function tilePattern(i: number) {
  return PATTERNS[(i * 3 + Math.floor(i / 9) * 5) % PATTERNS.length]
}

function TilesMosaic() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ backgroundColor: '#8B6914' }}
    >
      <div
        style={{
          display: 'grid',
          // minmax → tiles stretch to fill full width, no leftover strip
          gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
          gridAutoRows: '50px',
          gap: '3px',
          width: '100%',
          height: '100%',
        }}
      >
        {Array.from({ length: 320 }, (_, i) => {
          const pattern = tilePattern(i)
          return (
            <div
              key={i}
              style={{
                backgroundColor: tileColor(i),
                backgroundImage: pattern ?? undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15), inset 2px 2px 5px rgba(0,0,0,0.1)',
              }}
            />
          )
        })}
      </div>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}

// ── Shared utils ──────────────────────────────────────────────────────────────

const fredoka = { fontFamily: "'Fredoka', 'Poppins', sans-serif", fontWeight: 700 }
const pixel   = { fontFamily: "'Press Start 2P', monospace" }
const hatch   = { backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 6px)' }

function Brackets({ size = 10, color = 'rgba(0,0,0,0.45)' }: { size?: number; color?: string }) {
  const b: React.CSSProperties = { position: 'absolute', width: size, height: size, borderColor: color, borderStyle: 'solid' }
  return (
    <>
      <span style={{ ...b, top: 5, left: 5,    borderWidth: '2px 0 0 2px' }} />
      <span style={{ ...b, top: 5, right: 5,   borderWidth: '2px 2px 0 0' }} />
      <span style={{ ...b, bottom: 5, left: 5,  borderWidth: '0 0 2px 2px' }} />
      <span style={{ ...b, bottom: 5, right: 5, borderWidth: '0 2px 2px 0' }} />
    </>
  )
}

function Tape({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-10 rounded-sm"
      style={{ top: -10, width: wide ? 64 : 48, height: 20, background: 'rgba(255,255,255,0.55)' }}
    />
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const available = games.filter(g => g.path)
  const soon      = games.filter(g => !g.path)

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

      {/* ── Tile mosaic hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 200 }}>
        <TilesMosaic />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
          {/* Hatch-box logo — same brutalist style as before */}
          <div className="flex items-stretch w-fit" style={{ boxShadow: '5px 5px 0 rgba(0,0,0,0.7)' }}>
            <div className="relative bg-[#E90074] border-4 border-black px-6 py-4 overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)' }}>
              <Brackets size={8} />
              <span className="relative text-black leading-none" style={{ ...fredoka, fontSize: 'clamp(2rem, 8vw, 3.2rem)' }}>
                MOSAIC
              </span>
            </div>
            <div className="relative bg-black border-4 border-l-0 border-black px-6 py-4 overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(233,0,116,0.2) 3px, rgba(233,0,116,0.2) 6px)' }}>
              <Brackets size={8} color="rgba(233,0,116,0.5)" />
              <span className="relative leading-none" style={{ ...fredoka, fontSize: 'clamp(2rem, 8vw, 3.2rem)', color: '#E90074' }}>
                MIND
              </span>
            </div>
          </div>

          {/* Tagline — white text on pink */}
          <div className="mt-4">
            <span
              className="inline-block bg-[#E90074] px-3 py-2 text-[8px] uppercase tracking-widest"
              style={{ ...pixel, color: 'white' }}
            >
              Word games &amp; puzzles
            </span>
          </div>
        </div>
      </section>

      {/* ── Divider band ──────────────────────────────────────────────── */}
      <div className="relative bg-[#E90074] border-y-4 border-black px-6 py-3 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-16" style={hatch} />
        <p className="text-center text-black font-black uppercase tracking-[0.3em] text-sm" style={fredoka}>
          ↓ &nbsp; PICK A GAME &nbsp; ↓
        </p>
      </div>

      {/* ── Cards ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 py-14 flex flex-col gap-14">

        {available.map(game => (
          <Link key={game.title} to={game.path!} className="group block" style={{ transform: ROTATIONS[game.title] }}>
            <div
              className="relative rounded-sm transition-all duration-200 group-hover:brightness-105"
              style={{ backgroundColor: CARD_COLOR[game.title], boxShadow: '4px 10px 28px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.25)' }}
            >
              <Tape wide />
              <div className="flex items-center gap-6 px-8 py-7">
                <span className="text-5xl shrink-0">{game.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-black/50 text-[8px] uppercase tracking-widest mb-1.5" style={pixel}>Now Playing</p>
                  <h2 className="text-3xl text-black uppercase leading-none" style={fredoka}>{game.title}</h2>
                  <p className="text-black/70 text-sm font-bold mt-2">{game.description}</p>
                </div>
                <span className="text-black text-xl shrink-0 group-hover:translate-x-1 transition-transform" style={fredoka}>PLAY →</span>
              </div>
            </div>
          </Link>
        ))}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
          {soon.map(game => (
            <div
              key={game.title}
              className="relative cursor-not-allowed hover:brightness-105 transition-all duration-200"
              style={{ transform: ROTATIONS[game.title], transformOrigin: 'center top' }}
            >
              <div className="rounded-sm" style={{ backgroundColor: CARD_COLOR[game.title], boxShadow: '3px 8px 20px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)' }}>
                <Tape />
                <div className="px-4 pt-6 pb-5">
                  <span className="text-3xl">{game.emoji}</span>
                  <h2 className="text-base text-black uppercase mt-3 leading-tight" style={fredoka}>{game.title}</h2>
                  <p className="text-sm font-bold text-black/65 mt-1.5 leading-snug">{game.description}</p>
                  <span className="block text-[7px] text-black/50 uppercase mt-3" style={pixel}>Soon</span>
                </div>
              </div>
            </div>
          ))}
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
