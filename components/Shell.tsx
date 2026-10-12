import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import NavClient from './NavClient'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'

export default async function Shell({ children }: { children: React.ReactNode }) {
  const { t } = getT()
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return (
      <>
        <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="num text-xl">Number<span className="text-acc">#</span></Link>
          <nav className="flex items-center gap-1">
            <LangToggle /><ThemeToggle />
            <Link href="/search" className="hidden px-3 py-2 text-sm text-mut hover:text-fg sm:block">{t('nav.search')}</Link>
            <Link href="/login" className="px-3 py-2 text-sm text-mut hover:text-fg">{t('nav.login')}</Link>
            <Link href="/register" className="btn-p !px-5 !py-2 text-sm">{t('nav.register')}</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-5 pb-20 pt-6 md:px-10"><div>{children}</div></main>
      </>
    )
  }
  const { data } = await sb.from('profiles').select('number').eq('id', user.id).maybeSingle()
  const number = (data as { number: number } | null)?.number ?? null
  return (
    <>
      <NavClient number={number} />
      <main className="px-5 pb-28 pt-20 md:pb-12 md:pl-[104px] md:pr-10 md:pt-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </>
  )
}
