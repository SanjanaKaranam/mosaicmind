import { Link } from 'react-router-dom'

interface GameTile {
  title: string
  description: string
  path: string | null
  emoji: string
  icon?: string
}

const games: GameTile[] = [
  { title: 'CrypText',       description: 'Unscramble words against the clock. How many can you get?', path: '/unscramble', emoji: '🔀', icon: '/assets/cryptext-icon.svg' },
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
      style={{ backgroundColor: 'var(--home-tile-gap)' }}
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
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--home-tile-overlay)' }} />
    </div>
  )
}

// ── Shared utils ──────────────────────────────────────────────────────────────

const fredoka = { fontFamily: "'Fredoka', 'Poppins', sans-serif", fontWeight: 700 }
const pixel   = { fontFamily: "'Press Start 2P', monospace" }
const hatch   = { backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 6px)' }


const RANSOM_ROTATIONS = [-4, 3.5, -2.5, 5, -4.5, 2.5, 0, -3.5, 5.5, -2]
const RANSOM_COLORS = [
  TILE_PALETTE[20], // #1E3A8A  deep navy
  TILE_PALETTE[16], // #7C3AED  deep violet
  TILE_PALETTE[2],  // #991B1B  deep crimson
  TILE_PALETTE[23], // #92400E  deep burnt orange
  TILE_PALETTE[12], // #065F46  deep emerald
  TILE_PALETTE[0],  // #1E40AF  deep blue
  TILE_PALETTE[6],  // #0D9488  deep teal
  TILE_PALETTE[7],  // #C2410C  deep rust
  TILE_PALETTE[24], // #14532D  deep forest green
  TILE_PALETTE[22], // #7F1D1D  deep burgundy
]

function MagazineLogo() {
  const words = ['MOSAIC', 'MIND']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'nowrap' }}>
      <h1 className="sr-only">Mosaic Mind</h1>
      {words.map((word, wi) => {
        const offset = words.slice(0, wi).reduce((a, w) => a + w.length, 0)
        return (
          <div key={word} style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            {word.split('').map((letter, li) => (
              <div key={li} style={{
                transform: `rotate(${RANSOM_ROTATIONS[offset + li]}deg)`,
                filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.55))',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'CSAnikaDrawn', 'Fredoka', sans-serif",
                  fontSize: 'clamp(3rem, 7vw, 5.2rem)',
                  lineHeight: 1,
                  display: 'block',
                  color: RANSOM_COLORS[offset + li],
                }}>
                  {letter}
                </span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function TornPaper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      <img
        src="/assets/torn-paper.png"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'auto',
          height: 'auto',
          maxWidth: 'none',
          transform: 'translate(-50%, -50%) rotate(90deg) scaleX(0.45) scaleY(1.1)',
          filter: 'brightness(0.82) saturate(0.85)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '28px 48px 22px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </div>
    </div>
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
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--home-bg)',
        backgroundImage: [
          'linear-gradient(var(--home-bg-grid) 1px, transparent 1px)',
          'linear-gradient(90deg, var(--home-bg-grid) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '44px 44px',
      }}
    >

      {/* ── Tile mosaic hero ──────────────────────────────────────────── */}
      <section className="relative" style={{ minHeight: 200 }}>
        <TilesMosaic />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-2">
          <TornPaper>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '820px', width: '100%' }}>
              <MagazineLogo />
              <span style={{
                position: 'absolute', bottom: -34, right: 8,
                transform: 'rotate(3deg)',
                fontFamily: "'SoftlyHandwritten', cursive",
                fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
                color: '#000',
                lineHeight: 1,
                WebkitTextStroke: '1px #000',
              }}>
                games &amp; puzzles
              </span>
            </div>
          </TornPaper>
        </div>
      </section>

      {/* ── Divider band ──────────────────────────────────────────────── */}
      <div className="relative border-y-4 border-black px-6 py-3 overflow-hidden" style={{ backgroundColor: 'var(--home-banner-bg)' }}>
        <div className="absolute inset-y-0 left-0 w-16" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-16" style={hatch} />
        <p className="text-center font-black uppercase tracking-[0.3em] text-sm" style={{ ...fredoka, color: 'var(--home-banner-text)' }}>
          ↓ &nbsp; PICK A GAME &nbsp; ↓
        </p>
      </div>

      {/* ── Cards ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
          {games.map(game => {
            const inner = (
              <div className="rounded-sm relative" style={{ backgroundColor: CARD_COLOR[game.title], boxShadow: '3px 8px 20px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)' }}>
                <Tape />
                <div className="px-6 pt-8 pb-6 flex flex-col min-h-[190px]">
                  <div className="flex items-center gap-2">
                    {game.icon
                      ? <img src={game.icon} alt="" className="h-12 w-auto" />
                      : <span className="text-3xl">{game.emoji}</span>
                    }
                    <h2 className="text-lg text-black uppercase leading-tight" style={{ fontFamily: "'KarmaticArcade', 'Fredoka', sans-serif" }}>{game.title}</h2>
                  </div>
                  <p className="text-sm text-black/70 mt-2 leading-snug flex-1 font-bold">{game.description}</p>
                  <div className="flex justify-end mt-4">
                    <span className="inline-block text-xs uppercase px-3 py-1.5 border-2 border-black/40 rounded-sm"
                      style={{ fontWeight: 700, color: game.path ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)' }}>
                      {game.path ? 'Play Now →' : 'Soon'}
                    </span>
                  </div>
                </div>
              </div>
            )
            return game.path ? (
              <Link key={game.title} to={game.path} className="group block relative transition-all duration-200 hover:brightness-105"
                style={{ transform: ROTATIONS[game.title], transformOrigin: 'center top' }}>
                {inner}
              </Link>
            ) : (
              <div key={game.title} className="relative cursor-not-allowed hover:brightness-105 transition-all duration-200"
                style={{ transform: ROTATIONS[game.title], transformOrigin: 'center top' }}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="relative border-t-4 border-black px-6 py-4 overflow-hidden" style={{ backgroundColor: 'var(--home-banner-bg)' }}>
        <div className="absolute inset-y-0 left-0 w-16" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-16" style={hatch} />
        <p className="text-center text-[9px] uppercase tracking-widest" style={{ ...pixel, color: 'var(--home-banner-text)' }}>
          ✦ &nbsp; More games coming soon &nbsp; ✦
        </p>
      </div>

    </div>
  )
}
