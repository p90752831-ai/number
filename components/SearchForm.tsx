'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Icon from './Icon'

export default function SearchForm({ value = '' }: { value?: string }) {
  const router = useRouter()
  const [v, setV] = useState(value)
  const [err, setErr] = useState('')
  const [pending, start] = useTransition()
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!/^\d{1,6}$/.test(v)) return setErr('Введите номер: от 1 до 6 цифр.')
    setErr('')
    start(() => router.push(`/search?n=${v}`))
  }
  return (
    <form onSubmit={submit} role="search" className="w-full max-w-md">
      <div className="field flex items-center gap-1 rounded-full py-1.5 pl-5 pr-1.5" data-invalid={err ? 'true' : undefined}>
        <span className="num text-lg text-acc" aria-hidden="true">#</span>
        <input value={v} onChange={e => { setV(e.target.value.replace(/\D/g, '')); setErr('') }} inputMode="numeric" maxLength={6}
          placeholder="728" aria-label="Номер" aria-invalid={!!err} className="bare w-full min-w-0 px-2 py-2 text-lg font-medium" />
        {v && <button type="button" aria-label="Очистить" onClick={() => { setV(''); setErr('') }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mut hover:bg-line hover:text-fg"><Icon n="x" size={18} /></button>}
        <button className="btn-p shrink-0 !py-2.5" disabled={pending}>{pending ? 'Ищем…' : 'Найти'}</button>
      </div>
      {err && <p role="alert" className="mt-2 pl-5 text-sm text-err">{err}</p>}
    </form>
  )
}
