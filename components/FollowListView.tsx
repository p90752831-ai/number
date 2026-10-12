'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Person } from '@/lib/types'
import Avatar from './Avatar'
import Icon from './Icon'

const L = 20

export default function FollowListView({ uid, kind, initial, isOwner }: { uid: string; kind: 'followers' | 'following'; initial: Person[]; isOwner: boolean }) {
  const sb = createClient()
  const [items, setItems] = useState<Person[]>(initial)
  const [q, setQ] = useState('')
  const [asked, setAsked] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(initial.length < L)
  const [err, setErr] = useState('')

  async function load(reset: boolean) {
    setBusy(true); setErr('')
    const term = reset ? q.trim() : asked
    const { data, error } = await sb.rpc('follow_list', { uid, kind, q: term, lim: L, off: reset ? 0 : items.length })
    setBusy(false)
    if (error) return setErr('Не удалось загрузить список. Попробуйте ещё раз.')
    const n = (data ?? []) as Person[]
    setAsked(term); setItems(reset ? n : [...items, ...n]); setDone(n.length < L)
  }
  async function removeFollower(id: string) {
    if (!window.confirm('Удалить подписчика?')) return
    const { error } = await sb.from('follows').delete().eq('follower', id).eq('following', uid)
    if (error) return setErr(error.message)
    setItems(items.filter(p => p.id !== id))
  }
  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={e => { e.preventDefault(); load(true) }} role="search" className="field flex items-center gap-2 rounded-full px-4 py-1">
        <Icon n="search" size={18} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Имя или номер" aria-label="Поиск по списку" className="bare w-full py-2.5" />
      </form>
      {items.length === 0 && !busy && <p className="py-10 text-center text-mut">{asked ? 'Никого не найдено.' : kind === 'followers' ? 'Подписчиков пока нет.' : 'Подписок пока нет.'}</p>}
      <ul className="flex flex-col">
        {items.map(p => (
          <li key={p.id} className="flex items-center gap-3 border-t border-line py-3">
            <Link href={`/${p.number}`} className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar url={p.avatar_url} size={44} />
              <span className="min-w-0"><span className="block truncate font-semibold">{p.name || 'Без имени'}</span><span className="num text-sm text-acc">#{p.number}</span></span>
            </Link>
            {isOwner && kind === 'followers' && <button className="text-sm text-mut hover:text-fg" onClick={() => removeFollower(p.id)}>Удалить</button>}
          </li>
        ))}
      </ul>
      {err && <p role="alert" className="text-center text-sm text-err">{err}</p>}
      {!done && <div className="text-center"><button className="btn-s" disabled={busy} onClick={() => load(false)}>{busy ? 'Загрузка…' : 'Показать ещё'}</button></div>}
    </div>
  )
}
