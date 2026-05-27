import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Unscramble from './games/unscramble'
import SettingsPanel from './components/Settings/SettingsPanel'
import { useSettings } from './context/SettingsContext'

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default function App() {
  const { panelOpen, openPanel, closePanel } = useSettings()
  const location = useLocation()
  const showFloatingSettings = location.pathname === '/'

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unscramble" element={<Unscramble />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showFloatingSettings && (
        <button
          onClick={openPanel}
          className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center"
          aria-label="Open settings"
        >
          <GearIcon />
        </button>
      )}

      {panelOpen && <SettingsPanel onClose={closePanel} />}
    </>
  )
}
