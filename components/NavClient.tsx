'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

const P: Record<string, React.ReactNode> = {
  home: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  feed: <path d="M4 6h16M4 12h16M4 18h10" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5 7-5s7 1.5 7 5M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2.5.5 4 2 4 5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  settings: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
}
const Icon = ({ n }: { n: string }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
)

export default function NavClient({ number }: { number: number | null }) {
  const path = usePathname()
  const items = [
    { href: '/', label: 'Главная', icon: 'home' },
    { href: '/feed', label: 'Лента', icon: 'feed' },
    { href: '/search', label: 'Поиск', icon: 'search' },
    { href: '/follows', label: 'Подписки', icon: 'users' },
    { href: number !== null ? `/${number}` : '/dashboard', label: 'Профиль', icon: 'user' },
  ]
  const side = [...items, { href: '/profile/edit', label: 'Настройки', icon: 'settings' }]
  const cls = (h: string) => (path === h ? 'bg-card text-fg' : 'text-mut hover:text-fg')
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col gap-1 border-r border-line px-4 py-6 md:flex" aria-label="Навигация">
        <Link href="/" className="num mb-6 px-3 text-2xl">Number<span className="text-acc">#</span></Link>
        {side.map(i => (
          <Link key={i.href} href={i.href} aria-current={path === i.href ? 'page' : undefined} className={`flex items-center gap-3 rounded-2xl px-3 py-3 font-medium transition ${cls(i.href)}`}>
            <Icon n={i.icon} />{i.label}
          </Link>
        ))}
        <div className="mt-auto px-3 text-sm text-mut"><LogoutButton className="hover:text-fg">Выйти</LogoutButton></div>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-bg/90 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Навигация">
        {items.map(i => (
          <Link key={i.href} href={i.href} aria-current={path === i.href ? 'page' : undefined} className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] transition ${path === i.href ? 'text-acc' : 'text-mut'}`}>
            <Icon n={i.icon} />{i.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
