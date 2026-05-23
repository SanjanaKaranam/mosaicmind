import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  ACCENT_PRESETS, FONT_FAMILIES, FONT_SCALES, DEFAULT_SETTINGS,
  type Settings,
} from './settingsConfig'

interface SettingsContextValue {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  panelOpen: boolean
  openPanel: () => void
  closePanel: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function applySettings(s: Settings) {
  const root = document.documentElement
  const preset = ACCENT_PRESETS.find(p => p.accent === s.accent) ?? ACCENT_PRESETS[0]
  root.setAttribute('data-theme', s.theme)
  root.style.setProperty('--accent',        s.accent)
  root.style.setProperty('--accent-hover',  preset.hover)
  root.style.setProperty('--accent-subtle', preset.subtle)
  root.style.setProperty('--accent-text',   preset.text)
  root.style.setProperty('--font-family',   FONT_FAMILIES[s.font])
  root.style.setProperty('--font-scale',    FONT_SCALES[s.fontSize])
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('mm_settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    applySettings(settings)
    try { localStorage.setItem('mm_settings', JSON.stringify(settings)) } catch {}
  }, [settings])

  const update = (patch: Partial<Settings>) => setSettings(prev => ({ ...prev, ...patch }))
  const openPanel = () => setPanelOpen(true)
  const closePanel = () => setPanelOpen(false)

  return (
    <SettingsContext.Provider value={{ settings, update, panelOpen, openPanel, closePanel }}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
