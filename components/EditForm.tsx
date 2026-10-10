'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { KINDS } from '@/lib/links'
import type { Link, LinkKind, Profile } from '@/lib/types'
import Avatar from './Avatar'
import LogoutButton from './LogoutButton'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function EditForm({ profile, initialLinks }: { profile: Profile; initialLinks: Link[] }) {
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
    if (!TYPES.includes(file.type)) return setMsg({ ok: false, t: 'Фото: JPG, PNG или WebP.' })
    if (file.size > 2 * 1024 * 1024) return setMsg({ ok: false, t: 'Фото должно быть меньше 2 МБ.' })
    setMsg({ ok: true, t: 'Загрузка…' })
    const path = `${profile.id}/avatar-${Date.now()}.${file.type.split('/')[1]}`
    const { error } = await sb.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (error) return setMsg({ ok: false, t: `Не удалось загрузить: ${error.message}` })
    setAvatar(sb.storage.from('avatars').getPublicUrl(path).data.publicUrl)
    setMsg({ ok: true, t: 'Фото загружено. Нажмите «Сохранить».' })
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
    if (err) return setMsg({ ok: false, t: `Не удалось сохранить: ${err}` })
    setMsg({ ok: true, t: 'Сохранено.' }); router.refresh()
  }
  return (
    <form onSubmit={save} className="up flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold tracking-tighter">Настройки <span className="num text-acc">#{profile.number}</span></h1>
      <div className="flex items-center gap-4">
        <Avatar url={avatar} size={80} />
        <label className="btn-s cursor-pointer">Загрузить фото<input type="file" accept={TYPES.join(',')} onChange={upload} className="hidden" /></label>
      </div>
      <label className="flex flex-col gap-1 text-sm text-mut">Имя
        <input className="inp" value={name} maxLength={60} onChange={e => setName(e.target.value)} placeholder="Как вас зовут" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-mut">О себе
        <textarea className="inp" rows={3} maxLength={240} value={bio} onChange={e => setBio(e.target.value)} placeholder="Пара слов о себе" />
      </label>
      <label className="flex items-start gap-3 rounded-2xl bg-card p-4">
        <input type="checkbox" className="mt-1 h-5 w-5 accent-[#C8FF3D]" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
        <span><b>Закрытый профиль</b><br /><span className="text-sm text-mut">Подписаться можно только по заявке, которую вы одобряете. Записи и ссылки «только подписчикам» видят одобренные подписчики. В открытом профиле подписка одобряется сразу.</span></span>
      </label>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-mut">Ссылки (необязательно, до 10). Для каждой выберите, кто её видит.</p>
        {links.map((l, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl bg-card p-3">
            <div className="flex gap-2">
              <select className="inp !w-auto" aria-label="Тип ссылки" value={l.kind} onChange={e => upd(i, { kind: e.target.value as LinkKind })}>
                {KINDS.map(k => <option key={k.v} value={k.v}>{k.l}</option>)}
              </select>
              {l.kind === 'other' && <input className="inp" placeholder="Название" maxLength={30} value={l.label ?? ''} onChange={e => upd(i, { label: e.target.value })} />}
            </div>
            <input className="inp" placeholder={l.kind === 'website' || l.kind === 'other' ? 'example.com' : '@имя или ссылка'} maxLength={200} value={l.url} onChange={e => upd(i, { url: e.target.value })} />
            <div className="flex items-center justify-between gap-2">
              <select className="inp !w-auto !py-2 text-sm" aria-label="Кто видит" value={l.visibility} onChange={e => upd(i, { visibility: e.target.value as Link['visibility'] })}>
                <option value="public">🌍 Всем</option>
                <option value="followers">🔒 Только подписчикам</option>
              </select>
              <button type="button" className="text-sm text-mut hover:text-fg" onClick={() => setLinks(links.filter((_, j) => j !== i))}>Удалить</button>
            </div>
          </div>
        ))}
        {links.length < 10 && <button type="button" className="btn-s !py-2 text-sm" onClick={() => setLinks([...links, { kind: 'telegram', label: null, url: '', visibility: 'public' }])}>+ Добавить ссылку</button>}
      </div>
      {msg && <p role="status" className={msg.ok ? 'text-acc' : 'text-red-400'}>{msg.t}</p>}
      <button className="btn-p" disabled={busy}>{busy ? 'Сохраняем…' : 'Сохранить'}</button>
      <LogoutButton className="btn-s md:hidden">Выйти из аккаунта</LogoutButton>
    </form>
  )
}
