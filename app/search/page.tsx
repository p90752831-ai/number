import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SearchForm from '@/components/SearchForm'
import Avatar from '@/components/Avatar'
import type { Profile } from '@/lib/types'

export default async function Search({ searchParams }: { searchParams: { n?: string } }) {
  const raw = (searchParams.n ?? '').replace(/^#/, '').trim()
  const valid = /^\d{1,6}$/.test(raw)
  let p: Profile | null = null
  if (valid) {
    const { data } = await createClient().from('profiles').select('*').eq('number', parseInt(raw, 10)).maybeSingle()
    p = data as Profile | null
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold tracking-tighter">Найти по номеру</h1>
      <SearchForm value={raw} />
      {raw && !valid && <p className="text-red-400">Введите номер от 0 до 100000.</p>}
      {valid && !p && <p className="py-6 text-xl font-bold">Этот номер пока не занят.</p>}
      {p && (
        <Link href={`/${p.number}`} className="card up flex items-center gap-4 transition hover:bg-line">
          <span className="num text-5xl text-acc">#{p.number}</span>
          <div className="min-w-0 flex-1"><p className="truncate font-bold">{p.name || 'Без имени'}</p>{p.is_private && <p className="text-sm text-mut">🔒 Закрытый профиль</p>}</div>
          <Avatar url={p.avatar_url} size={48} />
        </Link>
      )}
    </div>
  )
}
