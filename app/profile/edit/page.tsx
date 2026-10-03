import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditForm from '@/components/EditForm'
import type { Profile } from '@/lib/types'

export default async function EditPage() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (!data) return <div className="card mt-8"><p>Your profile is being created. Refresh in a moment.</p></div>
  return <EditForm profile={data as Profile} />
}
