import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavClient from './NavClient'

export default async function Shell({ children }: { children: React.ReactNode }) {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return (
      <>
        <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <Link href="/" className="num text-xl">Number<span className="text-acc">#</span></Link>
          <nav className="flex items-center gap-2">
            <Link href="/search" className="px-3 py-2 text-sm text-mut hover:text-fg">Поиск</Link>
            <Link href="/login" className="px-3 py-2 text-sm text-mut hover:text-fg">Войти</Link>
            <Link href="/register" className="btn-p !px-5 !py-2 text-sm">Регистрация</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-5 pb-20 pt-4">{children}</main>
      </>
    )
  }
  const { data } = await sb.from('profiles').select('number').eq('id', user.id).maybeSingle()
  const number = (data as { number: number } | null)?.number ?? null
  return (
    <>
      <NavClient number={number} />
      <main className="mx-auto max-w-2xl px-5 pb-28 pt-6 md:ml-60 md:max-w-none md:px-10 md:pb-12">
        <div className="mx-auto max-w-2xl">{children}</div>
      </main>
    </>
  )
}
