import type { Link, LinkKind, Profile } from './types'
export const KINDS: { v: LinkKind; l: string }[] = [
  { v: 'telegram', l: 'Telegram' }, { v: 'instagram', l: 'Instagram' }, { v: 'vk', l: 'VK' },
  { v: 'website', l: 'Сайт' }, { v: 'other', l: 'Другое' },
]
const BASE: Record<string, string> = { telegram: 'https://t.me/', instagram: 'https://instagram.com/', vk: 'https://vk.com/' }
const isUrl = (s: string) => /^https?:\/\//i.test(s)
export function linkHref(l: Link) {
  const t = l.url.trim()
  if (isUrl(t)) return t
  if (BASE[l.kind]) return BASE[l.kind] + t.replace(/^@/, '')
  return 'https://' + t
}
export const linkLabel = (l: Link) => (l.kind === 'other' ? l.label?.trim() || 'Ссылка' : KINDS.find(k => k.v === l.kind)!.l)
export function completion(p: Profile) {
  const c = [p.name, p.bio, p.avatar_url]
  return Math.round((c.filter(x => x && x.trim()).length / c.length) * 100)
}
