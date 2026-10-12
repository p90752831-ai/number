import Link from 'next/link'
import type { Link as L, Person, Profile } from '@/lib/types'
import { linkHref, linkLabelKey } from '@/lib/links'
import { getT } from '@/lib/i18n-server'
import Avatar from './Avatar'
import CopyNumber from './CopyNumber'
import Icon from './Icon'

export default function ProfileHeader({ p, links, followers, following, actions, admins }: { p: Profile; links: L[]; followers: number; following: number; actions: React.ReactNode; admins?: Person[] }) {
  const { t, tn } = getT()
  const community = p.kind === 'community'
  return (
    <section className="flex flex-col items-start gap-4">
      <Avatar url={p.avatar_url} size={96} />
      <div>
        {community && <p className="mb-1 text-sm font-medium text-acc">{t('community.badge')}</p>}
        <h1 className="text-3xl font-bold leading-tight tracking-tight">{p.name || t('profile.number_fallback', { n: p.number })}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="num text-3xl text-acc">#{p.number}</span>
          <CopyNumber number={p.number} compact />
        </div>
        {p.is_private && <p className="mt-2 flex items-center gap-1.5 text-sm text-mut"><Icon n="lock" size={14} />{t('profile.private')}</p>}
      </div>
      <p className="max-w-sm text-mut">{p.bio || t(community ? 'community.no_bio' : 'profile.no_bio')}</p>
      <div className="flex gap-6">
        <Link href={`/${p.number}/followers`} className="group flex items-baseline gap-1.5 rounded-lg">
          <b className="num text-xl group-hover:text-acc">{followers}</b><span className="text-sm text-mut">{tn('profile.followers', followers)}</span>
        </Link>
        {!community && (
          <Link href={`/${p.number}/following`} className="group flex items-baseline gap-1.5 rounded-lg">
            <b className="num text-xl group-hover:text-acc">{following}</b><span className="text-sm text-mut">{tn('profile.following', following)}</span>
          </Link>
        )}
      </div>
      {actions}
      {community && admins && admins.length > 0 && (
        <div>
          <p className="mb-2 text-sm text-mut">{t('community.admins')}</p>
          <div className="flex flex-wrap gap-2">
            {admins.map(a => (
              <Link key={a.id} href={`/${a.number}`} className="pill !px-2 !py-1.5"><Avatar url={a.avatar_url} size={24} /><span className="num text-xs text-acc">#{a.number}</span></Link>
            ))}
          </div>
        </div>
      )}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((l, i) => (
            <a key={l.id ?? i} href={linkHref(l)} target="_blank" rel="noopener noreferrer nofollow" className="pill">
              {l.visibility === 'followers' && <span title={t('link.followers_only')}><Icon n="lock" size={14} /></span>}{l.kind === 'other' ? (l.label?.trim() || t('kind.other')) : t(linkLabelKey(l))}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
