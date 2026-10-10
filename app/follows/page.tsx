import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FollowButton from '@/components/FollowButton'
import type { Follow, Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Follows() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data } = await sb.from('follows').select('*').order('created_at', { ascending: false })
  const rows = (data ?? []) as Follow[]
  const otherOf = (f: Follow) => (f.follower === user.id ? f.following : f.follower)
  const ids = Array.from(new Set(rows.map(otherOf)))
  const { data: ps } = ids.length ? await sb.from('profiles').select('*').in('id', ids) : { data: [] as Profile[] }
  const pm = new Map<string, Profile>((ps ?? []).map((p: Profile) => [p.id, p] as [string, Profile]))

  const incoming = rows.filter(f => f.following === user.id && f.status === 'pending')
  const followers = rows.filter(f => f.following === user.id && f.status === 'accepted')
  const followingList = rows.filter(f => f.follower === user.id && f.status === 'accepted')
  const sent = rows.filter(f => f.follower === user.id && f.status === 'pending')

  const Section = ({ title, list }: { title: string; list: Follow[] }) => list.length === 0 ? null : (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold tracking-widest text-mut">{title}</h2>
      {list.map(f => {
        const oid = otherOf(f)
        const o = pm.get(oid)
        return (
          <div key={f.id} className="card flex flex-wrap items-center gap-3 !p-4">
            <Link href={`/${o?.number ?? ''}`} className="num text-3xl text-acc">#{o?.number ?? '?'}</Link>
            <span className="min-w-0 flex-1 truncate text-mut">{o?.name ?? ''}</span>
            <FollowButton me={user.id} other={oid}
              mine={rows.find(r => r.follower === user.id && r.following === oid) ?? null}
              theirs={rows.find(r => r.follower === oid && r.following === user.id) ?? null} />
          </div>
        )
      })}
    </section>
  )
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 pt-4">
      <h1 className="text-4xl font-extrabold tracking-tighter">Подписки</h1>
      {rows.length === 0 && (
        <div className="text-center"><p className="text-xl font-bold">Пока никого.</p>
          <p className="mt-2 text-mut">Найдите человека по номеру и нажмите «Подписаться».</p>
          <Link href="/search" className="btn-p mt-6">Найти по номеру</Link></div>
      )}
      <Section title="ЗАЯВКИ НА ПОДПИСКУ" list={incoming} />
      <Section title="ПОДПИСЧИКИ" list={followers} />
      <Section title="ВЫ ПОДПИСАНЫ" list={followingList} />
      <Section title="ИСХОДЯЩИЕ ЗАЯВКИ" list={sent} />
    </div>
  )
}
