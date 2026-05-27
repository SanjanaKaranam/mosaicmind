import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../../context/SettingsContext'

interface Props {
  title: string
  onRestart?: () => void
  onHome?: () => void
  onEndGame?: () => void
  children: ReactNode
}

const fredoka = { fontFamily: "'Fredoka', 'Poppins', sans-serif", fontWeight: 700 }
const pixel   = { fontFamily: "'Press Start 2P', monospace" }
const hatch   = { backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 6px)' }

export default function GameLayout({ title, onRestart, onHome, onEndGame, children }: Props) {
  const navigate = useNavigate()
  const { openPanel } = useSettings()
  const [confirmEnd, setConfirmEnd] = useState(false)
  if (!onEndGame && confirmEnd) setConfirmEnd(false)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--home-bg)',
        backgroundImage: [
          'linear-gradient(var(--home-bg-grid) 1px, transparent 1px)',
          'linear-gradient(90deg, var(--home-bg-grid) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '44px 44px',
      }}
    >
      {/* Header banner */}
      <header
        className="relative border-b-4 border-black overflow-hidden shrink-0"
        style={{ backgroundColor: 'var(--home-banner-bg)' }}
      >
        <div className="absolute inset-y-0 left-0 w-12" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-12" style={hatch} />

        <div className="relative z-10 flex items-center px-14 py-2 gap-3">
          {/* Left buttons */}
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded border-2 border-black/25 text-sm font-bold uppercase hover:bg-black/10 transition-colors"
              style={{ ...fredoka, color: 'var(--home-banner-text)' }}
            >
              ← All Games
            </button>
            {onHome && (
              <button
                onClick={onHome}
                className="px-4 py-2 rounded border-2 border-black/25 text-sm font-bold uppercase hover:bg-black/10 transition-colors"
                style={{ ...fredoka, color: 'var(--home-banner-text)' }}
              >
                ⌂ Game Home
              </button>
            )}
            {onRestart && (
              <button
                onClick={onRestart}
                className="px-4 py-2 rounded border-2 border-black/25 text-sm font-bold uppercase hover:bg-black/10 transition-colors"
                style={{ ...fredoka, color: 'var(--home-banner-text)' }}
              >
                ↺ Restart
              </button>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-lg sm:text-xl uppercase tracking-widest whitespace-nowrap"
            style={{ fontFamily: "'KarmaticArcade', 'Fredoka', sans-serif", color: 'var(--home-banner-text)' }}
          >
            {title}
          </h1>

          {/* Right buttons */}
          <div className="flex justify-end items-center gap-2 flex-1">
            {onEndGame && (
              confirmEnd ? (
                <>
                  <span className="text-sm font-bold uppercase" style={{ ...fredoka, color: 'var(--home-banner-text)' }}>
                    End game?
                  </span>
                  <button
                    onClick={() => { setConfirmEnd(false); onEndGame() }}
                    className="px-4 py-2 rounded border-2 border-red-700 bg-red-700 text-sm font-bold uppercase hover:bg-red-800 hover:border-red-800 transition-colors"
                    style={{ ...fredoka, color: '#ffffff' }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmEnd(false)}
                    className="px-4 py-2 rounded border-2 border-black/25 text-sm font-bold uppercase hover:bg-black/10 transition-colors"
                    style={{ ...fredoka, color: 'var(--home-banner-text)' }}
                  >
                    No
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmEnd(true)}
                  className="px-4 py-2 rounded border-2 border-red-700/50 text-sm font-bold uppercase hover:bg-red-700/10 transition-colors"
                  style={{ ...fredoka, color: '#b91c1c' }}
                >
                  ✕ End Game
                </button>
              )
            )}
            <button
              onClick={openPanel}
              title="Settings"
              className="px-4 py-2 rounded border-2 border-black/25 text-sm font-bold uppercase hover:bg-black/10 transition-colors"
              style={{ ...fredoka, color: 'var(--home-banner-text)' }}
            >
              ⚙ Settings
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="relative border-t-4 border-black overflow-hidden shrink-0"
        style={{ backgroundColor: 'var(--home-banner-bg)' }}
      >
        <div className="absolute inset-y-0 left-0 w-12" style={hatch} />
        <div className="absolute inset-y-0 right-0 w-12" style={hatch} />
        <p
          className="relative z-10 text-center py-3 text-xs uppercase tracking-widest"
          style={{ ...pixel, color: 'var(--home-banner-text)', opacity: 0.75 }}
        >
          ✦ &nbsp; Mosaic Mind &nbsp; ✦
        </p>
      </footer>
    </div>
  )
}
