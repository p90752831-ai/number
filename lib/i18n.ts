import { dict } from './dict'
export type Lang = 'ru' | 'en'
export type Vars = Record<string, string | number>

export function translate(lang: Lang, key: string, vars?: Vars) {
  let s = dict[lang][key] ?? dict.ru[key] ?? key
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(String(vars[k]))
  return s
}
export function plural(lang: Lang, key: string, n: number) {
  const cat = new Intl.PluralRules(lang).select(n)
  return translate(lang, dict[lang][`${key}.${cat}`] !== undefined ? `${key}.${cat}` : `${key}.other`, { n })
}
export function ago(lang: Lang, iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const r = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  if (s < 60) return translate(lang, 'time.now')
  if (s < 3600) return r.format(-Math.floor(s / 60), 'minute')
  if (s < 86400) return r.format(-Math.floor(s / 3600), 'hour')
  return r.format(-Math.floor(s / 86400), 'day')
}
export function makeT(lang: Lang) {
  return { lang, t: (k: string, v?: Vars) => translate(lang, k, v), tn: (k: string, n: number) => plural(lang, k, n) }
}
