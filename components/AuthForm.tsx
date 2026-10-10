'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const reg = mode === 'register'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg({ ok: false, t: 'Введите корректную почту.' })
    if (password.length < 8) return setMsg({ ok: false, t: 'Пароль — минимум 8 символов.' })
    setBusy(true)
    const sb = createClient()
    const { data, error } = reg ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) return setMsg({ ok: false, t: reg ? `Не удалось зарегистрироваться: ${error.message}` : 'Неверная почта или пароль.' })
    if (reg && data.user && data.user.identities?.length === 0) return setMsg({ ok: false, t: 'Эта почта уже зарегистрирована. Войдите.' })
    if (reg && !data.session) return setMsg({ ok: true, t: 'Почти готово: подтвердите почту по письму, затем войдите.' })
    window.location.href = '/'
  }
  return (
    <form onSubmit={submit} className="up mx-auto mt-6 flex max-w-sm flex-col gap-4">
      <h1 className="text-4xl font-extrabold tracking-tighter">{reg ? 'Получи свой номер' : 'С возвращением'}</h1>
      {reg && <p className="text-mut">Нужны только почта и пароль. Имя, фото и ссылки — позже, по желанию.</p>}
      <input className="inp" type="email" placeholder="Почта" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="inp" type="password" placeholder="Пароль (от 8 символов)" autoComplete={reg ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} />
      {msg && <p role="alert" className={msg.ok ? 'text-acc' : 'text-red-400'}>{msg.t}</p>}
      <button className="btn-p" disabled={busy}>{busy ? 'Подождите…' : reg ? 'Зарегистрироваться' : 'Войти'}</button>
      <p className="text-center text-sm text-mut">
        {reg ? <>Уже есть номер? <Link href="/login" className="text-fg underline">Войти</Link></>
             : <>Ещё нет номера? <Link href="/register" className="text-fg underline">Регистрация</Link></>}
      </p>
    </form>
  )
}
