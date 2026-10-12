import Link from 'next/link'
import type { Link as L, Profile } from '@/lib/types'
import { linkHref, linkLabel } from '@/lib/links'
import Avatar from './Avatar'
import CopyNumber from './CopyNumber'
import Icon from './Icon'

export default function ProfileHeader({ p, links, followers, following, actions }: { p: Profile; links: L[]; followers: number; following: number; actions: React.ReactNode }) {
  return (
    <section className="flex flex-col items-start gap-4">
      <Avatar url={p.avatar_url} size={96} />
      <div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">{p.name || `Номер ${p.number}`}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="num text-3xl text-acc">#{p.number}</span>
          <CopyNumber number={p.number} compact />
        </div>
        {p.is_private && <p className="mt-2 flex items-center gap-1.5 text-sm text-mut"><Icon n="lock" size={14} />Закрытый профиль</p>}
      </div>
      <p className="max-w-sm text-mut">{p.bio || 'Профиль пока не заполнен.'}</p>
      <div className="flex gap-6">
        <Link href={`/${p.number}/followers`} className="group flex items-baseline gap-1.5 rounded-lg" aria-label={`Подписчики: ${followers}`}>
          <b className="num text-xl group-hover:text-acc">{followers}</b><span className="text-sm text-mut">подписчиков</span>
        </Link>
        <Link href={`/${p.number}/following`} className="group flex items-baseline gap-1.5 rounded-lg" aria-label={`Подписки: ${following}`}>
          <b className="num text-xl group-hover:text-acc">{following}</b><span className="text-sm text-mut">подписок</span>
        </Link>
      </div>
      {actions}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((l, i) => (
            <a key={l.id ?? i} href={linkHref(l)} target="_blank" rel="noopener noreferrer nofollow" className="pill">
              {l.visibility === 'followers' && <span title="Только подписчикам"><Icon n="lock" size={14} /></span>}{linkLabel(l)}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
