import type { Link, Profile } from '@/lib/types'
import { linkHref, linkLabel } from '@/lib/links'
import Avatar from './Avatar'

export default function ProfileHeader({ p, links, followers, following }: { p: Profile; links: Link[]; followers: number; following: number }) {
  return (
    <section className="up flex flex-col items-center gap-4 pt-2 text-center">
      <div className="num text-[28vw] text-acc sm:text-[9rem]">#{p.number}</div>
      <Avatar url={p.avatar_url} size={96} />
      <div>
        <h1 className="text-2xl font-bold">{p.name || `Номер ${p.number}`}</h1>
        {p.is_private && <p className="mt-1 text-sm text-mut">🔒 Закрытый профиль</p>}
      </div>
      <p className="max-w-md text-mut">{p.bio || 'Профиль пока не заполнен.'}</p>
      <div className="flex gap-8">
        <div><div className="num text-2xl">{followers}</div><div className="text-xs text-mut">подписчиков</div></div>
        <div><div className="num text-2xl">{following}</div><div className="text-xs text-mut">подписок</div></div>
      </div>
      {links.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {links.map((l, i) => (
            <a key={l.id ?? i} href={linkHref(l)} target="_blank" rel="noopener noreferrer nofollow" className="pill">
              {l.visibility === 'followers' && <span title="Только подписчикам">🔒</span>}{linkLabel(l)}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
