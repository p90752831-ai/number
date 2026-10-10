import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditForm from '@/components/EditForm'
import type { Link, Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function EditPage() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (!data) return <div className="card break-all"><p>Профиль не найден.</p><p className="text-sm text-red-400">{error ? error.message : 'no error, row not found'}</p></div>
  const { data: ls } = await sb.from('profile_links').select('*').eq('user_id', user.id).order('position')
  return <EditForm profile={data as Profile} initialLinks={(ls ?? []) as Link[]} />
}
