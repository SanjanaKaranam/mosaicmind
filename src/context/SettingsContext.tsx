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

const SETTINGS_VERSION = '4'

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

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

  if (s.theme === 'dark') {
    root.style.setProperty('--home-bg',           preset.homeBg)
    root.style.setProperty('--home-bg-grid',      hexToRgba(preset.bannerBg, 0.18))
    root.style.setProperty('--home-banner-bg',    preset.bannerBg)
    root.style.setProperty('--home-banner-text',  preset.bannerText)
    root.style.setProperty('--home-tile-gap',     '#8B6914')
    root.style.setProperty('--home-tile-overlay', 'rgba(0,0,0,0.20)')
  } else {
    root.style.setProperty('--home-bg',           preset.bannerBg)
    root.style.setProperty('--home-bg-grid',      hexToRgba(preset.homeBg, 0.18))
    root.style.setProperty('--home-banner-bg',    preset.homeBg)
    root.style.setProperty('--home-banner-text',  preset.bannerBg)
    root.style.setProperty('--home-tile-gap',     '#D4A017')
    root.style.setProperty('--home-tile-overlay', 'rgba(0,0,0,0.05)')
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      if (localStorage.getItem('mm_settings_v') !== SETTINGS_VERSION) return DEFAULT_SETTINGS
      const saved = localStorage.getItem('mm_settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    applySettings(settings)
    try {
      localStorage.setItem('mm_settings', JSON.stringify(settings))
      localStorage.setItem('mm_settings_v', SETTINGS_VERSION)
    } catch {}
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
