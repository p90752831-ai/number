import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import EditForm from '@/components/EditForm'
import type { Link, Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function EditPage() {
  const { t } = getT()
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (!data) return <div className="break-all"><p>{t('common.profile_missing')}</p><p className="text-sm text-err">{error ? error.message : ''}</p></div>
  const { data: ls } = await sb.from('profile_links').select('*').eq('user_id', user.id).order('position')
  return <EditForm profile={data as Profile} initialLinks={(ls ?? []) as Link[]} />
}
