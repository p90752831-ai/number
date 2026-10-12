'use client'
import { useState } from 'react'
import { useI18n } from './I18nProvider'

export default function CopyNumber({ number, compact = false }: { number: number; compact?: boolean }) {
  const { t } = useI18n()
  const [ok, setOk] = useState(false)
  return (
    <button type="button" className={compact ? 'rounded-full border border-line px-3 py-1 text-xs font-medium text-mut transition hover:text-fg' : 'btn-s'} aria-live="polite" onClick={async () => {
      try { await navigator.clipboard.writeText(`#${number}`); setOk(true); setTimeout(() => setOk(false), 1800) } catch {}
    }}>{ok ? t('common.copied') : t(compact ? 'common.copy' : 'common.copy_number')}</button>
  )
}
