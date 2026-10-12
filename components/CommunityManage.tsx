'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Person, Profile } from '@/lib/types'
import Avatar from './Avatar'
import { useI18n } from './I18nProvider'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']
type Admin = Person & { role: 'owner' | 'admin' }

export default function CommunityManage({ c, admins, isOwner }: { c: Profile; admins: Admin[]; isOwner: boolean }) {
  const { t } = useI18n()
  const sb = createClient()
  const router = useRouter()
  const [name, setName] = useState(c.name ?? '')
  const [bio, setBio] = useState(c.bio ?? '')
  const [isPrivate, setIsPrivate] = useState(c.is_private)
  const [avatar, setAvatar] = useState<string | null>(c.avatar_url)
  const [target, setTarget] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!TYPES.includes(file.type)) return setMsg({ ok: false, t: t('photo.err_type') })
    if (file.size > 2 * 1024 * 1024) return setMsg({ ok: false, t: t('photo.err_size', { mb: 2 }) })
    const path = `${c.id}/avatar-${Date.now()}.${file.type.split('/')[1]}`
    const { error } = await sb.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (error) return setMsg({ ok: false, t: t('photo.err_upload', { m: error.message }) })
    setAvatar(sb.storage.from('avatars').getPublicUrl(path).data.publicUrl)
    setMsg({ ok: true, t: t('edit.photo_ready') })
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return setMsg({ ok: false, t: t('community.err_name') })
    setBusy(true); setMsg(null)
    const { error } = await sb.from('profiles').update({ name: name.trim(), bio: bio.trim() || null, avatar_url: avatar, is_private: isPrivate }).eq('id', c.id)
    setBusy(false)
    if (error) return setMsg({ ok: false, t: t('edit.err', { m: error.message }) })
    setMsg({ ok: true, t: t('common.saved') }); router.refresh()
  }
  async function addAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!/^\d{1,6}$/.test(target)) return setMsg({ ok: false, t: t('search.err') })
    const { error } = await sb.rpc('add_community_admin', { cid: c.id, target: parseInt(target, 10) })
    if (error) return setMsg({ ok: false, t: error.message.includes('not found') ? t('manage.err_person') : error.message })
    setTarget(''); setMsg({ ok: true, t: t('manage.admin_added') }); router.refresh()
  }
  async function removeAdmin(id: string) {
    const { error } = await sb.rpc('remove_community_admin', { cid: c.id, uid: id })
    if (error) return setMsg({ ok: false, t: error.message })
    router.refresh()
  }
  async function del() {
    if (confirm !== String(c.number)) return setMsg({ ok: false, t: t('manage.err_confirm') })
    const { error } = await sb.rpc('delete_community', { cid: c.id })
    if (error) return setMsg({ ok: false, t: error.message })
    window.location.href = '/'
  }
  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar url={avatar} size={80} />
          <label className="btn-s cursor-pointer">{t('edit.upload')}<input type="file" accept={TYPES.join(',')} onChange={upload} className="hidden" /></label>
        </div>
        <label className="flex flex-col gap-1 text-sm text-mut">{t('community.name')}<input className="inp" value={name} maxLength={60} onChange={e => setName(e.target.value)} /></label>
        <label className="flex flex-col gap-1 text-sm text-mut">{t('community.description')}<textarea className="inp" rows={3} maxLength={240} value={bio} onChange={e => setBio(e.target.value)} /></label>
        <label className="flex items-start gap-3 rounded-2xl bg-card p-4">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[rgb(var(--acc))]" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
          <span><b>{t('manage.private')}</b><br /><span className="text-sm text-mut">{t('manage.private_note')}</span></span>
        </label>
        <button className="btn-p" disabled={busy}>{busy ? t('common.saving') : t('common.save')}</button>
      </form>

      <section>
        <h2 className="mb-3 text-xl font-bold">{t('community.admins')}</h2>
        <ul>
          {admins.map(a => (
            <li key={a.id} className="flex items-center gap-3 border-t border-line py-3">
              <Link href={`/${a.number}`} className="flex min-w-0 flex-1 items-center gap-3"><Avatar url={a.avatar_url} size={40} />
                <span className="min-w-0"><span className="block truncate font-semibold">{a.name || t('common.no_name')}</span><span className="num text-sm text-acc">#{a.number}</span></span></Link>
              <span className="text-sm text-mut">{a.role === 'owner' ? t('manage.owner') : t('manage.admin')}</span>
              {isOwner && a.role === 'admin' && <button className="text-sm text-mut hover:text-fg" onClick={() => removeAdmin(a.id)}>{t('common.delete')}</button>}
            </li>
          ))}
        </ul>
        {isOwner && (
          <form onSubmit={addAdmin} className="mt-3 flex gap-2">
            <input className="inp" inputMode="numeric" maxLength={6} value={target} onChange={e => setTarget(e.target.value.replace(/\D/g, ''))} placeholder={t('manage.add_ph')} aria-label={t('manage.add_ph')} />
            <button className="btn-s shrink-0">{t('manage.add')}</button>
          </form>
        )}
      </section>

      {isOwner && (
        <section>
          <h2 className="mb-2 text-xl font-bold text-err">{t('manage.danger')}</h2>
          <p className="mb-3 text-sm text-mut">{t('manage.delete_note', { n: c.number })}</p>
          <div className="flex gap-2">
            <input className="inp" inputMode="numeric" value={confirm} onChange={e => setConfirm(e.target.value.replace(/\D/g, ''))} placeholder={String(c.number)} aria-label={t('manage.delete_aria')} />
            <button className="btn-s shrink-0 !border-err !text-err" onClick={del}>{t('manage.delete')}</button>
          </div>
        </section>
      )}
      {msg && <p role="status" className={msg.ok ? 'text-acc' : 'text-err'}>{msg.t}</p>}
    </div>
  )
}
