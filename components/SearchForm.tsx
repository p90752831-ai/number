'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Icon from './Icon'
import { useI18n } from './I18nProvider'

export default function SearchForm({ value = '' }: { value?: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const [v, setV] = useState(value)
  const [err, setErr] = useState('')
  const [pending, start] = useTransition()
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!/^\d{1,6}$/.test(v)) return setErr(t('search.err'))
    setErr('')
    start(() => router.push(`/search?n=${v}`))
  }
  return (
    <form onSubmit={submit} role="search" className="w-full max-w-md">
      <div className="field flex items-center gap-1 rounded-full py-1.5 pl-5 pr-1.5" data-invalid={err ? 'true' : undefined}>
        <span className="num text-lg text-acc" aria-hidden="true">#</span>
        <input value={v} onChange={e => { setV(e.target.value.replace(/\D/g, '')); setErr('') }} inputMode="numeric" maxLength={6}
          placeholder="728" aria-label={t('search.aria')} aria-invalid={!!err} className="bare w-full min-w-0 px-2 py-2 text-lg font-medium" />
        {v && <button type="button" aria-label={t('common.clear')} onClick={() => { setV(''); setErr('') }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mut hover:bg-line hover:text-fg"><Icon n="x" size={18} /></button>}
        <button className="btn-p shrink-0 !py-2.5" disabled={pending}>{pending ? t('search.busy') : t('search.go')}</button>
      </div>
      {err && <p role="alert" className="mt-2 pl-5 text-sm text-err">{err}</p>}
    </form>
  )
}
