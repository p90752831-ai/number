import type { Link, LinkKind, Profile } from './types'
export const KINDS: { v: LinkKind; k: string }[] = [
  { v: 'telegram', k: 'kind.telegram' }, { v: 'instagram', k: 'kind.instagram' }, { v: 'vk', k: 'kind.vk' },
  { v: 'website', k: 'kind.website' }, { v: 'other', k: 'kind.other' },
]
const BASE: Record<string, string> = { telegram: 'https://t.me/', instagram: 'https://instagram.com/', vk: 'https://vk.com/' }
const isUrl = (s: string) => /^https?:\/\//i.test(s)
export function linkHref(l: Link) {
  const t = l.url.trim()
  if (isUrl(t)) return t
  if (BASE[l.kind]) return BASE[l.kind] + t.replace(/^@/, '')
  return 'https://' + t
}
// returns an i18n key (or the user's own label for "other")
export const linkLabelKey = (l: Link) => KINDS.find(k => k.v === l.kind)!.k
export function completion(p: Profile) {
  const c = [p.name, p.bio, p.avatar_url]
  return Math.round((c.filter(x => x && x.trim()).length / c.length) * 100)
}
