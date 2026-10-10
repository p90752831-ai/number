'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PAGE } from '@/lib/const'
import type { Post } from '@/lib/types'
import PostCard from './PostCard'

export default function PostList({ initial, userIds, me, empty }: { initial: Post[]; userIds: string[]; me: string | null; empty: string }) {
  const sb = createClient()
  const [posts, setPosts] = useState<Post[]>(initial)
  const [done, setDone] = useState(initial.length < PAGE)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  useEffect(() => { setPosts(initial); setDone(initial.length < PAGE) }, [initial])

  async function more() {
    setBusy(true); setErr('')
    const { data, error } = await sb.from('posts').select('*, profiles(number,name,avatar_url)').in('user_id', userIds)
      .order('created_at', { ascending: false }).range(posts.length, posts.length + PAGE - 1)
    setBusy(false)
    if (error) return setErr('Не удалось загрузить записи. Попробуйте ещё раз.')
    const next = (data ?? []) as Post[]
    setPosts([...posts, ...next])
    if (next.length < PAGE) setDone(true)
  }
  if (posts.length === 0) return <p className="py-12 text-center text-mut">{empty}</p>
  return (
    <div>
      {posts.map(p => (
        <PostCard key={p.id} post={p} me={me}
          onDelete={id => setPosts(posts.filter(x => x.id !== id))}
          onSaved={(id, body) => setPosts(posts.map(x => (x.id === id ? { ...x, body, updated_at: new Date().toISOString() } : x)))} />
      ))}
      {err && <p role="alert" className="py-2 text-center text-sm text-red-400">{err}</p>}
      {!done && <div className="pt-4 text-center"><button className="btn-s" disabled={busy} onClick={more}>{busy ? 'Загрузка…' : 'Показать ещё'}</button></div>}
    </div>
  )
}
