'use client'
import { useEffect, useState } from 'react'
import Icon from './Icon'
import { useI18n } from './I18nProvider'

type T = 'light' | 'dark'

export default function ThemeToggle({ variant = 'icon' }: { variant?: 'icon' | 'nav' | 'segment' }) {
  const { t: tr } = useI18n()
  const [t, setT] = useState<T | null>(null)
  useEffect(() => { setT(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light') }, [])
  const set = (v: T) => {
    document.documentElement.dataset.theme = v
    try { localStorage.setItem('theme', v) } catch {}
    setT(v)
  }
  if (variant === 'segment') {
    return (
      <div role="group" aria-label={tr('theme.label')} className="inline-flex rounded-full border border-line p-1">
        {(['light', 'dark'] as const).map(v => (
          <button key={v} type="button" aria-pressed={t === v} onClick={() => set(v)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${t === v ? 'bg-acc text-accfg' : 'text-mut hover:text-fg'}`}>
            {tr(v === 'light' ? 'theme.light' : 'theme.dark')}
          </button>
        ))}
      </div>
    )
  }
  const next: T = t === 'dark' ? 'light' : 'dark'
  const label = tr(next === 'dark' ? 'theme.to_dark' : 'theme.to_light')
  const icon = <Icon n={t === 'dark' ? 'sun' : 'moon'} />
  if (variant === 'nav') return <button type="button" className="navlink" onClick={() => set(next)} aria-label={label}>{icon}<span className="lbl">{label}</span></button>
  return <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-mut transition hover:bg-card hover:text-fg" onClick={() => set(next)} aria-label={label} title={label}>{icon}</button>
}
