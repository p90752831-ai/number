'use client'
import { useState } from 'react'
import NextLink from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ago } from '@/lib/time'
import type { Comment, Post } from '@/lib/types'
import Avatar from './Avatar'

const SEL = '*, profiles(number,name,avatar_url)'

export default function PostCard({ post, me, onDelete, onSaved }: { post: Post; me: string | null; onDelete: (id: string) => void; onSaved: (id: string, body: string) => void }) {
  const sb = createClient()
  const own = me === post.user_id
  const a = post.profiles
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(post.body)
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [ctext, setCtext] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadComments() {
    const { data, error } = await sb.from('comments').select(SEL).eq('post_id', post.id).order('created_at')
    if (error) setErr(error.message); else setComments((data ?? []) as Comment[])
  }
  async function toggle() { const next = !open; setOpen(next); if (next) await loadComments() }
  async function addComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!me || !ctext.trim()) return
    setBusy(true); setErr('')
    const { error } = await sb.from('comments').insert({ post_id: post.id, user_id: me, body: ctext.trim() })
    setBusy(false)
    if (error) return setErr(error.message)
    setCtext(''); await loadComments()
  }
  async function delComment(id: string) { await sb.from('comments').delete().eq('id', id); await loadComments() }
  async function save() {
    const body = text.trim()
    if (!body && !post.image_url) return
    const { error } = await sb.from('posts').update({ body }).eq('id', post.id)
    if (error) return setErr(error.message)
    setEditing(false); onSaved(post.id, body)
  }
  async function remove() {
    if (!window.confirm('Удалить запись?')) return
    const { error } = await sb.from('posts').delete().eq('id', post.id)
    if (error) return setErr(error.message)
    const path = post.image_url?.split('/posts/')[1]
    if (path) await sb.storage.from('posts').remove([path])
    onDelete(post.id)
  }
  return (
    <article className="border-t border-line py-5">
      <header className="flex items-center gap-3">
        <NextLink href={`/${a?.number ?? ''}`}><Avatar url={a?.avatar_url} /></NextLink>
        <div className="min-w-0 flex-1">
          <NextLink href={`/${a?.number ?? ''}`} className="font-semibold hover:underline">{a?.name || `#${a?.number ?? '?'}`}</NextLink>
          <div className="text-sm text-mut"><span className="num">#{a?.number}</span> · <span suppressHydrationWarning>{ago(post.created_at)}</span>{post.updated_at !== post.created_at && ' · изменено'}</div>
        </div>
        {own && !editing && (
          <div className="flex gap-3 text-sm text-mut">
            <button className="hover:text-fg" onClick={() => setEditing(true)}>Изменить</button>
            <button className="hover:text-fg" onClick={remove}>Удалить</button>
          </div>
        )}
      </header>
      {editing ? (
        <div className="mt-3 flex flex-col gap-2">
          <textarea className="inp" rows={3} maxLength={2000} value={text} onChange={e => setText(e.target.value)} />
          <div className="flex gap-2"><button className="btn-p !py-2" onClick={save}>Сохранить</button><button className="btn-s !py-2" onClick={() => { setEditing(false); setText(post.body) }}>Отмена</button></div>
        </div>
      ) : post.body && <p className="mt-3 whitespace-pre-wrap break-words">{post.body}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {post.image_url && <img src={post.image_url} alt="" loading="lazy" className="mt-3 max-h-[28rem] w-full rounded-2xl object-cover" />}
      <button onClick={toggle} className="mt-3 text-sm text-mut hover:text-fg" aria-expanded={open}>{open ? 'Скрыть комментарии' : 'Комментарии'}</button>
      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {comments.length === 0 && <p className="text-sm text-mut">Комментариев пока нет.</p>}
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 text-sm">
              <Avatar url={c.profiles?.avatar_url} size={28} />
              <div className="min-w-0 flex-1">
                <NextLink href={`/${c.profiles?.number ?? ''}`} className="font-semibold hover:underline">{c.profiles?.name || `#${c.profiles?.number}`}</NextLink>{' '}
                <span className="break-words text-fg/90">{c.body}</span>
              </div>
              {(c.user_id === me || own) && <button className="text-mut hover:text-fg" aria-label="Удалить комментарий" onClick={() => delComment(c.id)}>✕</button>}
            </div>
          ))}
          {me ? (
            <form onSubmit={addComment} className="flex gap-2">
              <input className="inp !py-2" maxLength={500} value={ctext} onChange={e => setCtext(e.target.value)} placeholder="Написать комментарий" aria-label="Комментарий" />
              <button className="btn-p !px-4 !py-2" disabled={busy || !ctext.trim()}>→</button>
            </form>
          ) : <p className="text-sm text-mut">Войдите, чтобы комментировать.</p>}
        </div>
      )}
      {err && <p role="alert" className="mt-2 text-sm text-red-400">{err}</p>}
    </article>
  )
}
