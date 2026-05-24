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

type LetterCfg = {
  bg: string; color: string; rotate: string
  skew?: string; lower?: boolean; font: React.CSSProperties
  clipPath?: string; size?: string; w?: string; h?: string
}

const MAGAZINE_LETTERS: LetterCfg[] = [
  // M — hot pink, Fredoka, wide uneven blob
  { bg: '#FF2D78', color: '#000000', rotate: '-5deg',
    font: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700 },
    clipPath: 'polygon(0% 22%, 14% 4%, 42% 10%, 70% 0%, 92% 6%, 100% 20%, 95% 48%, 100% 72%, 88% 100%, 60% 92%, 30% 100%, 8% 94%, 0% 74%, 6% 48%)',
    size: 'clamp(74px, 8.5vw, 102px)' },
  // O — golden yellow, Poppins italic, rough circle
  { bg: '#FFD000', color: '#000000', rotate: '5deg', lower: true,
    font: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontStyle: 'italic' },
    clipPath: 'polygon(28% 6%, 55% 0%, 80% 8%, 96% 24%, 100% 52%, 90% 78%, 72% 96%, 45% 100%, 18% 90%, 4% 68%, 0% 42%, 8% 18%)',
    size: 'clamp(70px, 8vw, 96px)' },
  // S — cobalt blue, JetBrains Mono, slanted parallelogram
  { bg: '#1565C0', color: '#FFFFFF', rotate: '-4deg',
    font: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 },
    clipPath: 'polygon(18% 0%, 48% 6%, 80% 0%, 100% 14%, 96% 44%, 100% 78%, 82% 100%, 48% 94%, 15% 100%, 0% 82%, 5% 50%, 0% 20%)',
    size: 'clamp(72px, 8.2vw, 98px)' },
  // A — orange, Fredoka, wide trapezoid wider at top
  { bg: '#FF6B1A', color: '#111111', rotate: '6deg', lower: true,
    font: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700 },
    clipPath: 'polygon(0% 10%, 20% 0%, 52% 8%, 82% 0%, 100% 12%, 94% 40%, 100% 68%, 88% 100%, 58% 92%, 28% 100%, 6% 88%, 0% 55%)',
    size: 'clamp(72px, 8.2vw, 98px)' },
  // I — deep teal, Poppins bold, tall narrow jagged
  { bg: '#00695C', color: '#FFE600', rotate: '-4.5deg',
    font: { fontFamily: "'Poppins', sans-serif", fontWeight: 800 },
    clipPath: 'polygon(10% 2%, 45% 8%, 88% 0%, 100% 18%, 92% 50%, 100% 80%, 86% 100%, 48% 92%, 12% 100%, 0% 80%, 6% 50%, 0% 22%)',
    w: 'clamp(54px, 6vw, 74px)', h: 'clamp(74px, 8.5vw, 102px)' },
  // C — crimson, Poppins 800, concave left side
  { bg: '#C62828', color: '#FFFFFF', rotate: '2.5deg',
    font: { fontFamily: "'Poppins', sans-serif", fontWeight: 800 },
    clipPath: 'polygon(8% 0%, 45% 6%, 88% 0%, 100% 16%, 96% 48%, 100% 80%, 84% 100%, 42% 95%, 10% 100%, 0% 80%, 10% 52%, 0% 24%)',
    size: 'clamp(72px, 8.2vw, 98px)' },
  // M — near-black, Fredoka, irregular pentagon-ish
  { bg: '#121212', color: '#FF2D78', rotate: '-3deg',
    font: { fontFamily: "'Fredoka', sans-serif", fontWeight: 700 },
    clipPath: 'polygon(4% 16%, 20% 2%, 50% 8%, 82% 0%, 100% 18%, 96% 46%, 100% 75%, 85% 100%, 52% 94%, 20% 100%, 2% 86%, 0% 55%)',
    size: 'clamp(74px, 8.5vw, 102px)' },
  // I — sky blue, Nunito italic, stumpy wide blob
  { bg: '#0288D1', color: '#000000', rotate: '6deg', lower: true,
    font: { fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontStyle: 'italic' },
    clipPath: 'polygon(5% 8%, 38% 0%, 75% 6%, 96% 0%, 100% 22%, 94% 58%, 100% 88%, 72% 100%, 38% 94%, 8% 100%, 0% 78%, 6% 45%)',
    w: 'clamp(54px, 6vw, 74px)', h: 'clamp(72px, 8vw, 96px)' },
  // N — lime-yellow, Press Start 2P, chunky rotated block
  { bg: '#C8E600', color: '#111111', rotate: '-5deg',
    font: { fontFamily: "'Press Start 2P', monospace" },
    clipPath: 'polygon(6% 5%, 25% 0%, 58% 7%, 90% 0%, 100% 15%, 95% 45%, 100% 78%, 88% 100%, 55% 93%, 22% 100%, 4% 92%, 0% 62%, 5% 30%)',
    size: 'clamp(72px, 8vw, 96px)' },
  // D — deep purple, Nunito 800, wide with torn bottom
  { bg: '#6A1B9A', color: '#FFFFFF', rotate: '4deg',
    font: { fontFamily: "'Nunito', sans-serif", fontWeight: 800 },
    clipPath: 'polygon(5% 6%, 30% 0%, 65% 8%, 95% 0%, 100% 20%, 96% 52%, 100% 80%, 90% 100%, 55% 92%, 22% 100%, 4% 88%, 0% 55%, 6% 24%)',
    size: 'clamp(72px, 8.2vw, 98px)' },
]

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
  const available = games.filter(g => g.path)
  const soon      = games.filter(g => !g.path)

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden flex flex-col"
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
      <div className="relative bg-[#FFF078] border-y-4 border-black px-6 py-3 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-16" style={hatch} />
        <p className="text-center text-black font-black uppercase tracking-[0.3em] text-sm" style={fredoka}>
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
                  <p className="text-sm text-black/70 mt-2 leading-snug flex-1" style={{ fontFamily: "'Balmont', sans-serif" }}>{game.description}</p>
                  <div className="flex justify-end mt-4">
                    <span className="inline-block text-xs uppercase px-3 py-1.5 border-2 border-black/40 rounded-sm"
                      style={{ fontFamily: "'Balmont', sans-serif", fontWeight: 700, color: game.path ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)' }}>
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
