import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import FollowButton from '@/components/FollowButton'
import Avatar from '@/components/Avatar'
import type { Follow, Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Reached from your profile ("Requests"). Follower / following lists live under the counters in the profile.
export default async function Requests() {
  const { t } = getT()
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data } = await sb.from('follows').select('*').eq('status', 'pending').or(`follower.eq.${user.id},following.eq.${user.id}`).order('created_at', { ascending: false })
  const rows = (data ?? []) as Follow[]
  const otherOf = (f: Follow) => (f.follower === user.id ? f.following : f.follower)
  const ids = Array.from(new Set(rows.map(otherOf)))
  const { data: ps } = ids.length ? await sb.from('profiles').select('*').in('id', ids) : { data: [] as Profile[] }
  const pm = new Map<string, Profile>((ps ?? []).map((p: Profile) => [p.id, p] as [string, Profile]))
  const incoming = rows.filter(f => f.following === user.id)
  const sent = rows.filter(f => f.follower === user.id)
  const Section = ({ title, list }: { title: string; list: Follow[] }) => list.length === 0 ? null : (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-mut">{title}</h2>
      {list.map(f => {
        const oid = otherOf(f); const o = pm.get(oid)
        return (
          <div key={f.id} className="flex flex-wrap items-center gap-3 border-t border-line py-3">
            <Link href={`/${o?.number ?? ''}`} className="flex min-w-0 flex-1 items-center gap-3"><Avatar url={o?.avatar_url} size={44} />
              <span className="min-w-0"><span className="block truncate font-semibold">{o?.name || t('common.no_name')}</span><span className="num text-sm text-acc">#{o?.number ?? '?'}</span></span></Link>
            <FollowButton me={user.id} other={oid} mine={rows.find(r => r.follower === user.id && r.following === oid) ?? null} theirs={rows.find(r => r.follower === oid && r.following === user.id) ?? null} />
          </div>
        )
      })}
    </section>
  )
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">{t('requests.title')}</h1>
      {rows.length === 0 && <p className="py-10 text-center text-mut">{t('requests.none')}</p>}
      <Section title={t('requests.incoming')} list={incoming} />
      <Section title={t('requests.sent')} list={sent} />
    </div>
  )
}
