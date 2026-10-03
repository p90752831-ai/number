import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileCard from '@/components/ProfileCard'
import Qr from '@/components/Qr'
import type { Profile } from '@/lib/types'

export default async function PublicProfile({ params }: { params: { number: string } }) {
  if (!/^\d{1,6}$/.test(params.number)) notFound()
  const num = parseInt(params.number, 10)
  const { data } = await createClient().from('profiles').select('*').eq('number', num).maybeSingle()
  const p = data as Profile | null
  if (!p) {
    return (
      <div className="card up mx-auto mt-8 max-w-md text-center">
        <div className="big text-7xl text-mut">#{num}</div>
        <p className="mt-4 text-xl font-bold">This number is not registered yet.</p>
        <Link href="/register" className="btn-p mt-6">Maybe it will be yours</Link>
      </div>
    )
  }
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <ProfileCard p={p} />
      <Qr number={p.number} />
    </div>
  )
}
