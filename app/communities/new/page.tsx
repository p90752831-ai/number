import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CommunityCreate from '@/components/CommunityCreate'

export const dynamic = 'force-dynamic'

export default async function NewCommunity() {
  const { data: { user } } = await createClient().auth.getUser()
  if (!user) redirect('/login')
  return <CommunityCreate />
}
