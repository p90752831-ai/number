import type { Profile } from '@/lib/types'
import { socialLinks } from '@/lib/links'

export default function ProfileCard({ p }: { p: Profile }) {
  const links = socialLinks(p)
  return (
    <div className="card up flex flex-col items-center gap-4 py-10 text-center">
      <div className="big text-[22vw] text-acc sm:text-8xl">#{p.number}</div>
      {p.avatar_url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={p.avatar_url} alt="" className="h-24 w-24 rounded-full object-cover" />
        : <div className="flex h-24 w-24 items-center justify-center rounded-full border border-line text-3xl text-mut">#</div>}
      <div>
        <h1 className="text-2xl font-bold">{p.name || `Number ${p.number}`}</h1>
        {p.username && <p className="text-mut">@{p.username}</p>}
      </div>
      <p className="max-w-md text-mut">{p.bio || 'This profile is not filled in yet.'}</p>
      {links.length ? (
        <div className="flex flex-wrap justify-center gap-2">
          {links.map((l, i) => (
            <a key={i} href={l.href} target="_blank" rel="noopener noreferrer nofollow" className="btn-s !px-4 !py-2 text-sm">{l.label}</a>
          ))}
        </div>
      ) : <p className="text-sm text-mut">No social links yet.</p>}
    </div>
  )
}
