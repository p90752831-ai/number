'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { KINDS } from '@/lib/links'
import type { Link, LinkKind, Profile } from '@/lib/types'
import Avatar from './Avatar'
import LogoutButton from './LogoutButton'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'
import { useI18n } from './I18nProvider'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function EditForm({ profile, initialLinks }: { profile: Profile; initialLinks: Link[] }) {
  const { t } = useI18n()
  const sb = createClient()
  const router = useRouter()
  const [name, setName] = useState(profile.name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [isPrivate, setIsPrivate] = useState(profile.is_private)
  const [avatar, setAvatar] = useState<string | null>(profile.avatar_url)
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const upd = (i: number, patch: Partial<Link>) => setLinks(links.map((l, j) => (j === i ? { ...l, ...patch } : l)))

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!TYPES.includes(file.type)) return setMsg({ ok: false, t: t('photo.err_type') })
    if (file.size > 2 * 1024 * 1024) return setMsg({ ok: false, t: t('photo.err_size', { mb: 2 }) })
    setMsg({ ok: true, t: t('common.loading') })
    const path = `${profile.id}/avatar-${Date.now()}.${file.type.split('/')[1]}`
    const { error } = await sb.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (error) return setMsg({ ok: false, t: t('photo.err_upload', { m: error.message }) })
    setAvatar(sb.storage.from('avatars').getPublicUrl(path).data.publicUrl)
    setMsg({ ok: true, t: t('edit.photo_ready') })
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null); setBusy(true)
    const clean = links.filter(l => l.url.trim()).slice(0, 10).map((l, i) => ({
      user_id: profile.id, kind: l.kind, label: l.kind === 'other' ? (l.label ?? '').trim().slice(0, 30) || null : null,
      url: l.url.trim().slice(0, 200), visibility: l.visibility, position: i,
    }))
    const r1 = await sb.from('profiles').update({ name: name.trim() || null, bio: bio.trim() || null, avatar_url: avatar, is_private: isPrivate }).eq('id', profile.id)
    let err = r1.error?.message
    if (!err) err = (await sb.from('profile_links').delete().eq('user_id', profile.id)).error?.message
    if (!err && clean.length) err = (await sb.from('profile_links').insert(clean)).error?.message
    setBusy(false)
    if (err) return setMsg({ ok: false, t: t('edit.err', { m: err }) })
    setMsg({ ok: true, t: t('common.saved') }); router.refresh()
  }
  return (
    <form onSubmit={save} className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('edit.title')} <span className="num text-acc">#{profile.number}</span></h1>
      <div className="flex items-center gap-4">
        <Avatar url={avatar} size={80} />
        <label className="btn-s cursor-pointer">{t('edit.upload')}<input type="file" accept={TYPES.join(',')} onChange={upload} className="hidden" /></label>
      </div>
      <label className="flex flex-col gap-1 text-sm text-mut">{t('edit.name')}
        <input className="inp" value={name} maxLength={60} onChange={e => setName(e.target.value)} placeholder={t('edit.name_ph')} />
      </label>
      <label className="flex flex-col gap-1 text-sm text-mut">{t('edit.bio')}
        <textarea className="inp" rows={3} maxLength={240} value={bio} onChange={e => setBio(e.target.value)} placeholder={t('edit.bio_ph')} />
      </label>
      <label className="flex items-start gap-3 rounded-2xl bg-card p-4">
        <input type="checkbox" className="mt-1 h-5 w-5 accent-[rgb(var(--acc))]" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
        <span><b>{t('edit.private')}</b><br /><span className="text-sm text-mut">{t('edit.private_note')}</span></span>
      </label>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-mut">{t('edit.links_note')}</p>
        {links.map((l, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl bg-card p-3">
            <div className="flex gap-2">
              <select className="inp !w-auto" aria-label={t('edit.link_type')} value={l.kind} onChange={e => upd(i, { kind: e.target.value as LinkKind })}>
                {KINDS.map(k => <option key={k.v} value={k.v}>{t(k.k)}</option>)}
              </select>
              {l.kind === 'other' && <input className="inp" placeholder={t('edit.link_label')} maxLength={30} value={l.label ?? ''} onChange={e => upd(i, { label: e.target.value })} />}
            </div>
            <input className="inp" placeholder={l.kind === 'website' || l.kind === 'other' ? 'example.com' : t('edit.link_ph')} maxLength={200} value={l.url} onChange={e => upd(i, { url: e.target.value })} />
            <div className="flex items-center justify-between gap-2">
              <select className="inp !w-auto !py-2 text-sm" aria-label={t('edit.visibility')} value={l.visibility} onChange={e => upd(i, { visibility: e.target.value as Link['visibility'] })}>
                <option value="public">{t('edit.vis_public')}</option>
                <option value="followers">{t('edit.vis_followers')}</option>
              </select>
              <button type="button" className="text-sm text-mut hover:text-fg" onClick={() => setLinks(links.filter((_, j) => j !== i))}>{t('common.delete')}</button>
            </div>
          </div>
        ))}
        {links.length < 10 && <button type="button" className="btn-s !py-2 text-sm" onClick={() => setLinks([...links, { kind: 'telegram', label: null, url: '', visibility: 'public' }])}>{t('edit.add_link')}</button>}
      </div>
      <div className="flex items-center justify-between gap-3"><span className="text-sm text-mut">{t('theme.label')}</span><ThemeToggle variant="segment" /></div>
      <div className="flex items-center justify-between gap-3"><span className="text-sm text-mut">{t('lang.label')}</span><LangToggle variant="segment" /></div>
      {msg && <p role="status" className={msg.ok ? 'text-acc' : 'text-err'}>{msg.t}</p>}
      <button className="btn-p" disabled={busy}>{busy ? t('common.saving') : t('common.save')}</button>
      <LogoutButton className="btn-s md:hidden" label={false} />
    </form>
  )
}
