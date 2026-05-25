export type Theme = 'dark' | 'light'
export type FontSize = 'sm' | 'md' | 'lg'
export type FontFamily = 'system' | 'inter' | 'nunito' | 'mono' | 'poppins'

export interface AccentPreset {
  name: string
  accent: string
  hover: string
  subtle: string
  text: string
  // Homepage theming
  homeBg: string     // dark background color
  bannerBg: string   // banner/footer color (contrasts with homeBg)
  bannerText: string // text color on the banner
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { name: 'Pink',    accent: '#E90074', hover: '#FF4191', subtle: 'rgba(233,0,116,0.15)',   text: '#FFF078', homeBg: '#6D0033', bannerBg: '#FFF078', bannerText: '#000000' },
  { name: 'Purple',  accent: '#9333ea', hover: '#a855f7', subtle: 'rgba(147,51,234,0.15)', text: '#d8b4fe', homeBg: '#2D0A6B', bannerBg: '#FFF078', bannerText: '#000000' },
  { name: 'Blue',    accent: '#2563eb', hover: '#3b82f6', subtle: 'rgba(37,99,235,0.15)',  text: '#93c5fd', homeBg: '#0C2461', bannerBg: '#FFF078', bannerText: '#000000' },
  { name: 'Teal',    accent: '#0d9488', hover: '#14b8a6', subtle: 'rgba(13,148,136,0.15)', text: '#5eead4', homeBg: '#0A4840', bannerBg: '#FF4191', bannerText: '#000000' },
  { name: 'Orange',  accent: '#ea580c', hover: '#f97316', subtle: 'rgba(234,88,12,0.15)',  text: '#fdba74', homeBg: '#5C1E00', bannerBg: '#FFF078', bannerText: '#000000' },
  { name: 'Rose',    accent: '#e11d48', hover: '#f43f5e', subtle: 'rgba(225,29,72,0.15)',  text: '#fda4af', homeBg: '#5C0A1A', bannerBg: '#FFF078', bannerText: '#000000' },
]

export const FONT_FAMILIES: Record<FontFamily, string> = {
  system:  'system-ui, -apple-system, sans-serif',
  poppins: "'Poppins', sans-serif",
  inter:   "'Inter', sans-serif",
  nunito:  "'Nunito', sans-serif",
  mono:    "'JetBrains Mono', monospace",
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
  accent:   '#E90074',
  fontSize: 'md',
  font:     'poppins',
}
