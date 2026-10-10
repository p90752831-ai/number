import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Composer from '@/components/Composer'
import PostList from '@/components/PostList'
import { PAGE } from '@/lib/const'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Feed() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')
  const { data: fs } = await sb.from('follows').select('following').eq('follower', user.id).eq('status', 'accepted')
  const ids = [user.id, ...(fs ?? []).map((f: { following: string }) => f.following)]
  const { data: ps } = await sb.from('posts').select('*, profiles(number,name,avatar_url)').in('user_id', ids)
    .order('created_at', { ascending: false }).range(0, PAGE - 1)
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold tracking-tighter">Лента</h1>
      <Composer me={user.id} />
      <PostList initial={(ps ?? []) as Post[]} userIds={ids} me={user.id} empty="Здесь пока пусто. Подпишитесь на людей по номеру — их записи появятся в ленте." />
    </div>
  )
}
