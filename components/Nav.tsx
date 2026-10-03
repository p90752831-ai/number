import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Nav() {
  const { data: { user } } = await createClient().auth.getUser()
  const a = 'hover:text-fg'
  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
      <Link href="/" className="text-xl font-extrabold tracking-tighter">NUMBER<span className="text-acc">#</span></Link>
      <nav className="flex flex-wrap items-center gap-4 text-sm text-mut">
        <Link href="/search" className={a}>Find</Link>
        <Link href="/marketplace" className={a}>Marketplace</Link>
        {user ? (
          <>
            <Link href="/dashboard" className={a}>My NUMBER</Link>
            <Link href="/profile/edit" className={a}>Edit profile</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className={a}>Log in</Link>
            <Link href="/register" className="btn-p !px-4 !py-2">Get number</Link>
          </>
        )}
      </nav>
    </header>
  )
}
