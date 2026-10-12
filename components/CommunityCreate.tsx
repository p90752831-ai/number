'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from './I18nProvider'

export default function CommunityCreate() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return setErr(t('community.err_name'))
    setBusy(true); setErr('')
    const { data, error } = await createClient().rpc('create_community', { p_name: name.trim(), p_description: bio.trim() || null })
    setBusy(false)
    if (error) return setErr(error.message.includes('limit') ? t('community.err_limit') : t('community.err_create', { m: error.message }))
    window.location.href = `/${data}`
  }
  return (
    <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t('community.create_title')}</h1>
      <p className="text-mut">{t('community.create_note')}</p>
      <label className="flex flex-col gap-1 text-sm text-mut">{t('community.name')}
        <input className="inp" value={name} maxLength={60} onChange={e => setName(e.target.value)} placeholder={t('community.name_ph')} />
      </label>
      <label className="flex flex-col gap-1 text-sm text-mut">{t('community.description')}
        <textarea className="inp" rows={3} maxLength={240} value={bio} onChange={e => setBio(e.target.value)} />
      </label>
      {err && <p role="alert" className="text-err">{err}</p>}
      <button className="btn-p" disabled={busy}>{busy ? t('common.wait') : t('community.create_btn')}</button>
    </form>
  )
}
