export type Theme = 'dark' | 'light'
export type FontSize = 'sm' | 'md' | 'lg'
export type FontFamily = 'system' | 'inter' | 'nunito' | 'mono'

export interface AccentPreset {
  name: string
  accent: string
  hover: string
  subtle: string
  text: string
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { name: 'Purple', accent: '#9333ea', hover: '#a855f7', subtle: 'rgba(147,51,234,0.15)', text: '#d8b4fe' },
  { name: 'Blue',   accent: '#2563eb', hover: '#3b82f6', subtle: 'rgba(37,99,235,0.15)',  text: '#93c5fd' },
  { name: 'Green',  accent: '#16a34a', hover: '#22c55e', subtle: 'rgba(22,163,74,0.15)',  text: '#86efac' },
  { name: 'Teal',   accent: '#0d9488', hover: '#14b8a6', subtle: 'rgba(13,148,136,0.15)', text: '#5eead4' },
  { name: 'Orange', accent: '#ea580c', hover: '#f97316', subtle: 'rgba(234,88,12,0.15)',  text: '#fdba74' },
  { name: 'Rose',   accent: '#e11d48', hover: '#f43f5e', subtle: 'rgba(225,29,72,0.15)',  text: '#fda4af' },
]

export const FONT_FAMILIES: Record<FontFamily, string> = {
  system: 'system-ui, -apple-system, sans-serif',
  inter:  "'Inter', sans-serif",
  nunito: "'Nunito', sans-serif",
  mono:   "'JetBrains Mono', monospace",
}

export const FONT_SCALES: Record<FontSize, string> = {
  sm: '0.875',
  md: '1',
  lg: '1.125',
}

export interface Settings {
  theme:    Theme
  accent:   string
  fontSize: FontSize
  font:     FontFamily
}

export const DEFAULT_SETTINGS: Settings = {
  theme:    'dark',
  accent:   '#9333ea',
  fontSize: 'md',
  font:     'system',
}
