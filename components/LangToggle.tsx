'use client'
import { useRouter } from 'next/navigation'
import { useI18n } from './I18nProvider'
import type { Lang } from '@/lib/i18n'
import Icon from './Icon'

export default function LangToggle({ variant = 'icon' }: { variant?: 'icon' | 'nav' | 'segment' }) {
  const { lang, t } = useI18n()
  const router = useRouter()
  const set = (l: Lang) => { document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`; router.refresh() }
  const next: Lang = lang === 'ru' ? 'en' : 'ru'
  if (variant === 'segment') {
    return (
      <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-full border border-line p-1">
        {(['ru', 'en'] as const).map(l => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => set(l)} className={`rounded-full px-5 py-2 text-sm font-medium transition ${lang === l ? 'bg-acc text-accfg' : 'text-mut hover:text-fg'}`}>{l === 'ru' ? 'Русский' : 'English'}</button>
        ))}
      </div>
    )
  }
  if (variant === 'nav') return <button type="button" className="navlink" onClick={() => set(next)} aria-label={t('lang.switch')}><Icon n="globe" /><span className="lbl">{lang === 'ru' ? 'English' : 'Русский'}</span></button>
  return <button type="button" className="inline-flex h-10 items-center rounded-full px-3 text-sm font-semibold uppercase text-mut transition hover:bg-card hover:text-fg" onClick={() => set(next)} aria-label={t('lang.switch')}>{next}</button>
}
