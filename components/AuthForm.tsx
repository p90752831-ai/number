'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const reg = mode === 'register'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg({ ok: false, t: 'Enter a valid email.' })
    if (password.length < 8) return setMsg({ ok: false, t: 'Password must be at least 8 characters.' })
    setBusy(true)
    const sb = createClient()
    const { data, error } = reg ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) return setMsg({ ok: false, t: reg ? `Registration failed: ${error.message}` : 'Wrong email or password.' })
    if (reg && !data.session) return setMsg({ ok: true, t: 'Almost there — check your email to confirm, then log in.' })
    router.push('/dashboard'); router.refresh()
  }
  return (
    <form onSubmit={submit} className="card up mx-auto mt-8 flex max-w-sm flex-col gap-4">
      <h1 className="text-3xl font-extrabold tracking-tighter">{reg ? 'Get your number' : 'Welcome back'}</h1>
      <input className="inp" type="email" placeholder="Email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="inp" type="password" placeholder="Password (8+ characters)" autoComplete={reg ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} />
      {msg && <p className={msg.ok ? 'text-acc' : 'text-red-400'}>{msg.t}</p>}
      <button className="btn-p" disabled={busy}>{busy ? '…' : reg ? 'Register' : 'Log in'}</button>
      <p className="text-center text-sm text-mut">
        {reg ? <>Already have a number? <Link href="/login" className="text-fg underline">Log in</Link></>
             : <>No number yet? <Link href="/register" className="text-fg underline">Register</Link></>}
      </p>
    </form>
  )
}
