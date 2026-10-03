import type { Profile } from './types'
const isUrl = (s: string) => /^https?:\/\//i.test(s)
const abs = (s: string) => (isUrl(s) ? s : 'https://' + s)
export function socialLinks(p: Profile) {
  const out: { label: string; href: string }[] = []
  const add = (label: string, v: string | null, base: string) => {
    const t = (v ?? '').trim()
    if (t) out.push({ label, href: isUrl(t) ? t : base + t.replace(/^@/, '') })
  }
  add('Telegram', p.telegram, 'https://t.me/')
  add('Instagram', p.instagram, 'https://instagram.com/')
  add('VK', p.vk, 'https://vk.com/')
  if ((p.website ?? '').trim()) out.push({ label: 'Website', href: abs(p.website!.trim()) })
  for (const l of p.links ?? []) if (l.url?.trim()) out.push({ label: l.label?.trim() || 'Link', href: abs(l.url.trim()) })
  return out
}
export function completion(p: Profile) {
  const checks = [p.name, p.username, p.bio, p.avatar_url, socialLinks(p).length ? 'x' : null]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
