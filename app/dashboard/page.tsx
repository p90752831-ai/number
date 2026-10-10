import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Qr from '@/components/Qr'
import CopyNumber from '@/components/CopyNumber'
import { completion } from '@/lib/links'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const p = data as Profile | null
  if (!p) return <div className="card break-all"><p>Профиль не найден.</p><p className="text-sm text-red-400">{error ? error.message : 'строки нет, ошибки нет'}</p></div>
  const { count } = await sb.from('follows').select('id', { count: 'exact', head: true }).eq('following', user.id).eq('status', 'pending')
  const pct = completion(p)
  return (
    <div className="flex flex-col gap-6">
      <section className="up text-center">
        <p className="text-sm font-semibold tracking-widest text-mut">ВАШ НОМЕР</p>
        <div className="num my-3 text-[30vw] text-acc sm:text-[9rem]">#{p.number}</div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={`/${p.number}`} className="btn-p">Мой профиль</Link>
          <CopyNumber number={p.number} />
        </div>
      </section>
      {pct < 100 && (
        <div>
          <div className="mb-1 flex justify-between text-sm text-mut"><span>Профиль заполнен</span><span>{pct}%</span></div>
          <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-acc transition-all" style={{ width: `${pct}%` }} /></div>
          <Link href="/profile/edit" className="mt-3 inline-block text-sm text-acc hover:underline">Заполнить →</Link>
        </div>
      )}
      {!!count && <Link href="/follows" className="card text-center text-acc">Новых заявок на подписку: {count} →</Link>}
      <Qr number={p.number} />
    </div>
  )
}
