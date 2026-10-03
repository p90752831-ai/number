'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ExtraLink } from '@/lib/types'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function EditForm({ profile }: { profile: Profile }) {
  const sb = createClient()
  const router = useRouter()
  const [f, setF] = useState({
    name: profile.name ?? '', username: profile.username ?? '', bio: profile.bio ?? '',
    telegram: profile.telegram ?? '', instagram: profile.instagram ?? '', vk: profile.vk ?? '', website: profile.website ?? '',
  })
  const [links, setLinks] = useState<ExtraLink[]>(profile.links ?? [])
  const [avatar, setAvatar] = useState<string | null>(profile.avatar_url)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!TYPES.includes(file.type)) return setMsg({ ok: false, t: 'Photo must be JPG, PNG or WebP.' })
    if (file.size > 2 * 1024 * 1024) return setMsg({ ok: false, t: 'Photo must be under 2 MB.' })
    setMsg({ ok: true, t: 'Uploading…' })
    const path = `${profile.id}/avatar-${Date.now()}.${file.type.split('/')[1]}`
    const { error } = await sb.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (error) return setMsg({ ok: false, t: `Upload failed: ${error.message}` })
    setAvatar(sb.storage.from('avatars').getPublicUrl(path).data.publicUrl)
    setMsg({ ok: true, t: 'Photo uploaded. Press “Save changes” to apply.' })
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null)
    const username = f.username.trim().toLowerCase().replace(/^@/, '')
    if (username && !/^[a-z0-9_]{3,20}$/.test(username)) return setMsg({ ok: false, t: 'Username: 3–20 chars, a–z, 0–9, underscore.' })
    setBusy(true)
    const clean = links.filter(l => l.url.trim()).slice(0, 5).map(l => ({ label: l.label.trim().slice(0, 30), url: l.url.trim().slice(0, 200) }))
    const n = (s: string) => s.trim() || null
    const { error } = await sb.from('profiles').update({
      name: n(f.name), username: username || null, bio: n(f.bio), avatar_url: avatar,
      telegram: n(f.telegram), instagram: n(f.instagram), vk: n(f.vk), website: n(f.website), links: clean,
    }).eq('id', profile.id)
    setBusy(false)
    if (error) return setMsg({ ok: false, t: error.code === '23505' ? 'This username is already taken.' : `Could not save: ${error.message}` })
    setMsg({ ok: true, t: 'Saved.' }); router.refresh()
  }

  const row = (k: keyof typeof f, label: string, ph = '') => (
    <label className="flex flex-col gap-1 text-sm text-mut">{label}
      <input className="inp text-fg" value={f[k]} onChange={set(k)} placeholder={ph} maxLength={k === 'website' ? 200 : 100} />
    </label>
  )
  return (
    <form onSubmit={save} className="card up mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-3xl font-extrabold tracking-tighter">Edit profile <span className="text-acc">#{profile.number}</span></h1>
      <div className="flex items-center gap-4">
        {avatar
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
          : <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line text-2xl text-mut">#</div>}
        <label className="btn-s cursor-pointer">Upload photo<input type="file" accept={TYPES.join(',')} onChange={upload} className="hidden" /></label>
      </div>
      {row('name', 'Name', 'Pavel Kiryushkin')}
      {row('username', 'Username', 'pavel')}
      <label className="flex flex-col gap-1 text-sm text-mut">Bio
        <textarea className="inp text-fg" rows={3} maxLength={240} value={f.bio} onChange={set('bio')} placeholder="Developer and founder." />
      </label>
      {row('telegram', 'Telegram', '@username')}
      {row('instagram', 'Instagram', '@username')}
      {row('vk', 'VK', 'id or link')}
      {row('website', 'Website', 'example.com')}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-mut">Other links (up to 5)</p>
        {links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input className="inp w-28" placeholder="Label" maxLength={30} value={l.label} onChange={e => setLinks(links.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
            <input className="inp" placeholder="URL" maxLength={200} value={l.url} onChange={e => setLinks(links.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} />
            <button type="button" aria-label="Remove" className="px-2 text-mut hover:text-fg" onClick={() => setLinks(links.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        {links.length < 5 && <button type="button" className="btn-s !py-2 text-sm" onClick={() => setLinks([...links, { label: '', url: '' }])}>+ Add link</button>}
      </div>
      {msg && <p className={msg.ok ? 'text-acc' : 'text-red-400'}>{msg.t}</p>}
      <button className="btn-p" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
    </form>
  )
}
