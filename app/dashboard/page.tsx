import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Qr from '@/components/Qr'
import { completion } from '@/lib/links'
import type { Profile } from '@/lib/types'

export default async function Dashboard() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const p = data as Profile | null
  if (!p) return <div className="card mt-8"><p>Your profile is being created. Refresh in a moment.</p></div>
  const pct = completion(p)
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="card up text-center">
        <p className="text-sm font-bold tracking-widest text-mut">YOUR NUMBER</p>
        <div className="big my-4 text-[24vw] text-acc sm:text-9xl">#{p.number}</div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={`/${p.number}`} className="btn-p">View profile</Link>
          <Link href="/profile/edit" className="btn-s">Edit profile</Link>
        </div>
        <div className="mt-6 text-left">
          <div className="mb-1 flex justify-between text-sm text-mut"><span>Profile completion</span><span>{pct}%</span></div>
          <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-acc transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>
      <Qr number={p.number} />
    </div>
  )
}
