import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Unscramble from './games/unscramble'
import SettingsPanel from './components/Settings/SettingsPanel'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unscramble" element={<Unscramble />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center text-base"
        aria-label="Open settings"
      >
        ⚙
      </button>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </>
  )
}
