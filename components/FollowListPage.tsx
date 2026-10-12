import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import FollowListView from './FollowListView'
import Icon from './Icon'
import type { Person, Profile } from '@/lib/types'

export default async function FollowListPage({ number, kind }: { number: string; kind: 'followers' | 'following' }) {
  const { t } = getT()
  if (!/^\d{1,6}$/.test(number)) notFound()
  const sb = createClient()
  const { data } = await sb.from('profiles').select('*').eq('number', parseInt(number, 10)).maybeSingle()
  const p = data as Profile | null
  if (!p) notFound()
  const { data: { user } } = await sb.auth.getUser()
  const own = !!user && user.id === p.id
  let isAdmin = false
  if (user && p.kind === 'community') {
    const { data: m } = await sb.from('community_members').select('user_id').eq('community_id', p.id).eq('user_id', user.id).maybeSingle()
    isAdmin = !!m
  }
  let allowed = !p.is_private || own || isAdmin
  if (!allowed && user) {
    const { data: f } = await sb.from('follows').select('id').eq('follower', user.id).eq('following', p.id).eq('status', 'accepted').maybeSingle()
    allowed = !!f
  }
  let initial: Person[] = []
  if (allowed) {
    const { data: r } = await sb.rpc('follow_list', { uid: p.id, kind, q: '', lim: 20, off: 0 })
    initial = (r ?? []) as Person[]
  }
  return (
    <div className="mx-auto max-w-xl">
      <Link href={`/${p.number}`} className="mb-6 inline-flex items-center gap-1 text-sm text-mut hover:text-fg"><Icon n="back" size={16} /><span className="num text-acc">#{p.number}</span> {p.name}</Link>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{kind === 'followers' ? t('lists.followers') : t('lists.following')}</h1>
      {allowed
        ? <FollowListView uid={p.id} kind={kind} initial={initial} canRemove={own || isAdmin} />
        : <p className="flex items-center justify-center gap-2 py-10 text-mut"><Icon n="lock" size={18} />{t('lists.locked')}</p>}
    </div>
  )
}
