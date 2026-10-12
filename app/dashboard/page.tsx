import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import Qr from '@/components/Qr'
import CopyNumber from '@/components/CopyNumber'
import { completion } from '@/lib/links'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const { t, tn } = getT()
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const p = data as Profile | null
  if (!p) return <div className="break-all"><p>{t('common.profile_missing')}</p><p className="text-sm text-err">{error ? error.message : ''}</p></div>
  const { count } = await sb.from('follows').select('id', { count: 'exact', head: true }).eq('following', user.id).eq('status', 'pending')
  const pct = completion(p)
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <section className="text-center">
        <p className="text-mut">{t('home.yournumber')}</p>
        <div className="num my-3 text-[26vw] text-acc md:text-[7rem]">#{p.number}</div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={`/${p.number}`} className="btn-p">{t('dashboard.my_profile')}</Link>
          <CopyNumber number={p.number} />
        </div>
      </section>
      {pct < 100 && (
        <div>
          <div className="mb-1 flex justify-between text-sm text-mut"><span>{t('dashboard.completion')}</span><span>{pct}%</span></div>
          <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-acc transition-all" style={{ width: `${pct}%` }} /></div>
          <Link href="/profile/edit" className="mt-3 inline-block text-sm text-acc hover:underline">{t('dashboard.fill')}</Link>
        </div>
      )}
      {!!count && <Link href="/follows" className="card text-center text-acc">{tn('dashboard.requests', count)}</Link>}
      <Qr number={p.number} />
    </div>
  )
}
