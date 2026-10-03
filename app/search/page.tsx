import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SearchForm from '@/components/SearchForm'
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
    <div className="flex flex-col gap-6 pt-4">
      <h1 className="text-4xl font-extrabold tracking-tighter">Find a person by number</h1>
      <SearchForm value={raw} />
      {raw && !valid && <p className="text-red-400">Enter a number from 1 to 100000.</p>}
      {valid && !p && <div className="card max-w-md"><p className="text-xl font-bold">This number is not registered yet.</p></div>}
      {p && (
        <div className="card up flex max-w-md items-center gap-4">
          <div className="big text-5xl text-acc">#{p.number}</div>
          <div className="flex-1"><p className="font-bold">{p.name || 'No name yet'}</p>{p.username && <p className="text-sm text-mut">@{p.username}</p>}</div>
          <Link href={`/${p.number}`} className="btn-p !px-4 !py-2">View profile</Link>
        </div>
      )}
    </div>
  )
}
