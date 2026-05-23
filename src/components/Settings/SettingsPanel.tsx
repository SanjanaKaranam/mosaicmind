import { useSettings } from '../../context/SettingsContext'
import { ACCENT_PRESETS } from '../../context/settingsConfig'
import type { FontFamily, FontSize, Theme } from '../../context/settingsConfig'

const FONTS: { value: FontFamily; label: string; preview: string }[] = [
  { value: 'poppins', label: 'Poppins',    preview: "'Poppins', sans-serif" },
  { value: 'system',  label: 'System',     preview: 'system-ui, -apple-system, sans-serif' },
  { value: 'inter',   label: 'Inter',      preview: "'Inter', sans-serif" },
  { value: 'nunito',  label: 'Nunito',     preview: "'Nunito', sans-serif" },
  { value: 'mono',    label: 'Monospace',  preview: "'JetBrains Mono', monospace" },
]

const SIZES: { value: FontSize; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
]

const THEMES: { value: Theme; label: string }[] = [
  { value: 'dark',  label: '🌙 Dark' },
  { value: 'light', label: '☀️ Light' },
]

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, update } = useSettings()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-wide uppercase">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Theme</span>
          <div className="flex gap-2">
            {THEMES.map(t => (
              <button
                key={t.value}
                onClick={() => update({ theme: t.value })}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  settings.theme === t.value
                    ? 'border-[var(--accent)] text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
                style={settings.theme === t.value ? { backgroundColor: 'var(--accent-subtle)' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent color */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Color</span>
          <div className="flex gap-3">
            {ACCENT_PRESETS.map(preset => (
              <button
                key={preset.name}
                title={preset.name}
                onClick={() => update({ accent: preset.accent })}
                className="w-8 h-8 rounded-full transition-transform"
                style={{
                  backgroundColor: preset.accent,
                  outline: settings.accent === preset.accent ? `3px solid ${preset.accent}` : 'none',
                  outlineOffset: '2px',
                  transform: settings.accent === preset.accent ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Font Size</span>
          <div className="flex gap-2">
            {SIZES.map(s => (
              <button
                key={s.value}
                onClick={() => update({ fontSize: s.value })}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  settings.fontSize === s.value
                    ? 'border-[var(--accent)] text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
                style={settings.fontSize === s.value ? { backgroundColor: 'var(--accent-subtle)' } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font family */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Font</span>
          <div className="grid grid-cols-2 gap-2">
            {FONTS.map(f => (
              <button
                key={f.value}
                onClick={() => update({ font: f.value })}
                className={`py-2 px-3 rounded-lg border text-sm text-left transition-colors ${
                  settings.font === f.value
                    ? 'border-[var(--accent)] text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
                style={{
                  fontFamily: f.preview,
                  ...(settings.font === f.value ? { backgroundColor: 'var(--accent-subtle)' } : {}),
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
