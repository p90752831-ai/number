import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import CommunityManage from '@/components/CommunityManage'
import FollowButton from '@/components/FollowButton'
import Avatar from '@/components/Avatar'
import Icon from '@/components/Icon'
import type { Follow, Person, Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Manage({ params }: { params: { number: string } }) {
  const { t } = getT()
  if (!/^\d{1,6}$/.test(params.number)) notFound()
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data } = await sb.from('profiles').select('*').eq('number', parseInt(params.number, 10)).maybeSingle()
  const c = data as Profile | null
  if (!c || c.kind !== 'community') notFound()
  const { data: ms } = await sb.from('community_members').select('user_id,role').eq('community_id', c.id)
  const members = (ms ?? []) as { user_id: string; role: 'owner' | 'admin' }[]
  if (!members.some(m => m.user_id === user.id)) redirect(`/${c.number}`)
  const isOwner = members.some(m => m.user_id === user.id && m.role === 'owner')
  const { data: aps } = await sb.from('profiles').select('id,number,name,avatar_url').in('id', members.map(m => m.user_id))
  const admins = ((aps ?? []) as Person[]).map(a => ({ ...a, role: members.find(m => m.user_id === a.id)!.role }))
  const { data: rq } = await sb.from('follows').select('*').eq('following', c.id).eq('status', 'pending')
  const reqs = (rq ?? []) as Follow[]
  const { data: rps } = reqs.length ? await sb.from('profiles').select('id,number,name,avatar_url').in('id', reqs.map(r => r.follower)) : { data: [] as Person[] }
  const pm = new Map<string, Person>(((rps ?? []) as Person[]).map(p => [p.id, p] as [string, Person]))
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-10">
      <div>
        <Link href={`/${c.number}`} className="mb-4 inline-flex items-center gap-1 text-sm text-mut hover:text-fg"><Icon n="back" size={16} /><span className="num text-acc">#{c.number}</span> {c.name}</Link>
        <h1 className="text-3xl font-bold tracking-tight">{t('community.manage')}</h1>
      </div>
      {reqs.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-bold">{t('manage.requests')}</h2>
          {reqs.map(r => {
            const o = pm.get(r.follower)
            return (
              <div key={r.id} className="flex flex-wrap items-center gap-3 border-t border-line py-3">
                <Link href={`/${o?.number ?? ''}`} className="flex min-w-0 flex-1 items-center gap-3"><Avatar url={o?.avatar_url} size={44} />
                  <span className="min-w-0"><span className="block truncate font-semibold">{o?.name || t('common.no_name')}</span><span className="num text-sm text-acc">#{o?.number ?? '?'}</span></span></Link>
                <FollowButton me={user.id} other={r.follower} mine={null} theirs={r} compact />
              </div>
            )
          })}
        </section>
      )}
      <CommunityManage c={c} admins={admins} isOwner={isOwner} />
    </div>
  )
}
