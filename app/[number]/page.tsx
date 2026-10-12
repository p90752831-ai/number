import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileHeader from '@/components/ProfileHeader'
import FollowButton from '@/components/FollowButton'
import Composer from '@/components/Composer'
import PostList from '@/components/PostList'
import PhotoGallery from '@/components/PhotoGallery'
import Icon from '@/components/Icon'
import Qr from '@/components/Qr'
import { PAGE } from '@/lib/const'
import type { Follow, Link as L, Post, Profile } from '@/lib/types'

export default async function PublicProfile({ params }: { params: { number: string } }) {
  if (!/^\d{1,6}$/.test(params.number)) notFound()
  const num = parseInt(params.number, 10)
  const sb = createClient()
  const { data } = await sb.from('profiles').select('*').eq('number', num).maybeSingle()
  const p = data as Profile | null
  if (!p) {
    return (
      <div className="mx-auto mt-8 max-w-md text-center">
        <div className="num text-7xl text-mut">#{num}</div>
        <p className="mt-4 text-xl font-bold">Этот номер пока свободен.</p>
        <Link href="/register" className="btn-p mt-6">Получить номер</Link>
      </div>
    )
  }
  const { data: { user } } = await sb.auth.getUser()
  const own = !!user && user.id === p.id
  const { data: ls } = await sb.from('profile_links').select('*').eq('user_id', p.id).order('position')
  const { data: c } = await sb.rpc('follow_counts', { uid: p.id })
  const cnt = (Array.isArray(c) ? c[0] : c) as { followers: number; following: number } | undefined
  let mine: Follow | null = null
  let theirs: Follow | null = null
  let incoming = 0
  let sent = 0
  if (user && !own) {
    const { data: fs } = await sb.from('follows').select('*')
      .or(`and(follower.eq.${user.id},following.eq.${p.id}),and(follower.eq.${p.id},following.eq.${user.id})`)
    const rows = (fs ?? []) as Follow[]
    mine = rows.find(f => f.follower === user.id) ?? null
    theirs = rows.find(f => f.follower === p.id) ?? null
  }
  if (own) {
    const { data: pend } = await sb.from('follows').select('follower').eq('status', 'pending').or(`follower.eq.${p.id},following.eq.${p.id}`)
    const rows = (pend ?? []) as { follower: string }[]
    incoming = rows.filter(r => r.follower !== p.id).length
    sent = rows.length - incoming
  }
  const hidden = p.is_private && !own && mine?.status !== 'accepted'
  let posts: Post[] = []
  let photos: { id: string; image_url: string }[] = []
  if (!hidden) {
    const [a, b] = await Promise.all([
      sb.from('posts').select('*, profiles(number,name,avatar_url)').eq('user_id', p.id).order('created_at', { ascending: false }).range(0, PAGE - 1),
      sb.from('posts').select('id,image_url').eq('user_id', p.id).not('image_url', 'is', null).order('created_at', { ascending: false }).range(0, 8),
    ])
    posts = (a.data ?? []) as Post[]
    photos = (b.data ?? []) as { id: string; image_url: string }[]
  }
  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      {!user && <Link href="/login" className="btn-p">Войти, чтобы подписаться</Link>}
      {own && <Link href="/profile/edit" className="btn-s">Редактировать</Link>}
      {own && (incoming > 0 || sent > 0) && <Link href="/follows" className="btn-s">Заявки{incoming > 0 ? ` (${incoming})` : ''}</Link>}
      {user && !own && <FollowButton me={user.id} other={p.id} mine={mine} theirs={theirs} />}
    </div>
  )
  return (
    <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-10 lg:self-start">
        <ProfileHeader p={p} links={(ls ?? []) as L[]} followers={Number(cnt?.followers ?? 0)} following={Number(cnt?.following ?? 0)} actions={actions} />
        <details>
          <summary className="cursor-pointer text-sm text-mut hover:text-fg">QR-код профиля</summary>
          <div className="mt-3"><Qr number={p.number} /></div>
        </details>
      </aside>
      <div className="flex min-w-0 flex-col gap-8">
        {!hidden && <PhotoGallery initial={photos} userId={p.id} />}
        {own && user && <Composer me={user.id} />}
        {hidden
          ? <p className="flex items-center justify-center gap-2 py-10 text-mut"><Icon n="lock" size={18} />Записи этого профиля видят только подписчики.</p>
          : <PostList initial={posts} userIds={[p.id]} me={user?.id ?? null} empty={own ? 'Здесь появятся ваши записи.' : 'Записей пока нет.'} />}
      </div>
    </div>
  )
}
