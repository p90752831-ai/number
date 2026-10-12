'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Icon from './Icon'
import LogoutButton from './LogoutButton'
import ThemeToggle from './ThemeToggle'

export default function NavClient({ number }: { number: number | null }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const me = number !== null ? `/${number}` : '/dashboard'
  const main = [
    { href: '/feed', label: 'Лента', icon: 'feed' },
    { href: '/search', label: 'Поиск', icon: 'search' },
    { href: me, label: 'Профиль', icon: 'user' },
  ]
  const extra = [
    { href: '/dashboard', label: 'Мой номер', icon: 'hash' },
    { href: '/profile/edit', label: 'Настройки', icon: 'settings' },
  ]
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [open])
  const cur = (h: string) => (path === h ? 'page' : undefined)
  const cls = (h: string) => `navlink ${path === h ? 'is-active' : ''}`

  return (
    <>
      {/* desktop: collapsed rail, opens on hover or keyboard focus, overlays content (no layout shift) */}
      <aside className="side fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-bg md:flex" aria-label="Основная навигация">
        <Link href="/" aria-label="Number# — на главную" className="relative flex h-20 items-center px-[26px]">
          <span className="num logo-short text-2xl text-acc">#</span>
          <span className="num logo-full absolute left-[26px] whitespace-nowrap text-xl">Number<span className="text-acc">#</span></span>
        </Link>
        <nav className="flex flex-col gap-1">
          {[...main, ...extra].map(i => (
            <Link key={i.href} href={i.href} title={i.label} aria-current={cur(i.href)} className={cls(i.href)}>
              <Icon n={i.icon} /><span className="lbl">{i.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pb-5">
          <ThemeToggle variant="nav" />
          <LogoutButton className="navlink"><Icon n="logout" /><span className="lbl">Выйти</span></LogoutButton>
        </div>
      </aside>

      {/* mobile: logo bar, bottom tabs, tap-to-open sheet */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-14 items-center border-b border-line bg-bg/90 px-5 backdrop-blur md:hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <Link href="/" className="num text-xl" aria-label="Number# — на главную">Number<span className="text-acc">#</span></Link>
      </header>
      {open && <button aria-label="Закрыть меню" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {open && (
          <div id="more-sheet" role="dialog" aria-label="Меню" className="mx-3 mb-2 flex flex-col gap-1 rounded-3xl border border-line bg-card p-3 shadow-xl">
            {extra.map(i => (
              <Link key={i.href} href={i.href} aria-current={cur(i.href)} className={`${cls(i.href)} !m-0 !w-full`}><Icon n={i.icon} />{i.label}</Link>
            ))}
            <div className="flex items-center justify-between px-3 py-2"><span className="text-sm text-mut">Оформление</span><ThemeToggle variant="segment" /></div>
            <LogoutButton className="navlink !m-0 !w-full"><Icon n="logout" />Выйти</LogoutButton>
          </div>
        )}
        <nav className="flex border-t border-line bg-bg/95 backdrop-blur" aria-label="Основная навигация">
          {main.map(i => (
            <Link key={i.href} href={i.href} aria-current={cur(i.href)} className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${path === i.href ? 'text-acc' : 'text-mut'}`}>
              <Icon n={i.icon} />{i.label}
            </Link>
          ))}
          <button type="button" aria-expanded={open} aria-controls="more-sheet" onClick={() => setOpen(!open)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${open ? 'text-acc' : 'text-mut'}`}>
            <Icon n="more" />Ещё
          </button>
        </nav>
      </div>
    </>
  )
}
