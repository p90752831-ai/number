import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileHeader from '@/components/ProfileHeader'
import FollowButton from '@/components/FollowButton'
import Composer from '@/components/Composer'
import PostList from '@/components/PostList'
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
      <div className="up mt-8 text-center">
        <div className="num text-8xl text-mut">#{num}</div>
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
  if (user && !own) {
    const { data: fs } = await sb.from('follows').select('*')
      .or(`and(follower.eq.${user.id},following.eq.${p.id}),and(follower.eq.${p.id},following.eq.${user.id})`)
    const rows = (fs ?? []) as Follow[]
    mine = rows.find(f => f.follower === user.id) ?? null
    theirs = rows.find(f => f.follower === p.id) ?? null
  }
  const hidden = p.is_private && !own && mine?.status !== 'accepted'
  let posts: Post[] = []
  if (!hidden) {
    const { data: ps } = await sb.from('posts').select('*, profiles(number,name,avatar_url)').eq('user_id', p.id).order('created_at', { ascending: false }).range(0, PAGE - 1)
    posts = (ps ?? []) as Post[]
  }
  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader p={p} links={(ls ?? []) as L[]} followers={Number(cnt?.followers ?? 0)} following={Number(cnt?.following ?? 0)} />
      <div className="flex justify-center">
        {!user && <div className="text-center"><p className="mb-3 text-mut">Войдите, чтобы подписаться.</p><Link href="/login" className="btn-p">Войти</Link></div>}
        {own && <Link href="/profile/edit" className="btn-s">Настройки профиля</Link>}
        {user && !own && <FollowButton me={user.id} other={p.id} mine={mine} theirs={theirs} />}
      </div>
      <section aria-label="Стена" className="flex flex-col gap-4">
        <h2 className="text-sm font-bold tracking-widest text-mut">СТЕНА</h2>
        {own && user && <Composer me={user.id} />}
        {hidden
          ? <p className="py-10 text-center text-mut">🔒 Записи этого профиля видят только подписчики.</p>
          : <PostList initial={posts} userIds={[p.id]} me={user?.id ?? null} empty={own ? 'Здесь появятся ваши записи.' : 'Записей пока нет.'} />}
      </section>
      <details className="group">
        <summary className="cursor-pointer text-center text-sm text-mut hover:text-fg">QR-код профиля</summary>
        <div className="mt-4"><Qr number={p.number} /></div>
      </details>
    </div>
  )
}
