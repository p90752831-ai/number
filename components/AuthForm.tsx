'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from './I18nProvider'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const reg = mode === 'register'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg({ ok: false, t: t('auth.err_email') })
    if (password.length < 8) return setMsg({ ok: false, t: t('auth.err_password') })
    setBusy(true)
    const sb = createClient()
    const { data, error } = reg ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) return setMsg({ ok: false, t: reg ? t('auth.err_register', { m: error.message }) : t('auth.err_login') })
    if (reg && data.user && data.user.identities?.length === 0) return setMsg({ ok: false, t: t('auth.err_exists') })
    if (reg && !data.session) return setMsg({ ok: true, t: t('auth.confirm') })
    window.location.href = '/'
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-6 flex max-w-sm flex-col gap-4">
      <h1 className="text-4xl font-bold tracking-tight">{reg ? t('auth.title_register') : t('auth.title_login')}</h1>
      {reg && <p className="text-mut">{t('auth.note_register')}</p>}
      <input className="inp" type="email" placeholder={t('auth.email')} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="inp" type="password" placeholder={t('auth.password')} autoComplete={reg ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} />
      {msg && <p role="alert" className={msg.ok ? 'text-acc' : 'text-err'}>{msg.t}</p>}
      <button className="btn-p" disabled={busy}>{busy ? t('common.wait') : reg ? t('auth.submit_register') : t('auth.submit_login')}</button>
      <p className="text-center text-sm text-mut">
        {reg ? <>{t('auth.have_account')} <Link href="/login" className="text-fg underline">{t('nav.login')}</Link></>
             : <>{t('auth.no_account')} <Link href="/register" className="text-fg underline">{t('nav.register')}</Link></>}
      </p>
    </form>
  )
}
