import { cookies, headers } from 'next/headers'
import { makeT, type Lang } from './i18n'

// cookie "lang" wins; first visit follows the browser language (ru -> ru, everything else -> en)
export function getLang(): Lang {
  const c = cookies().get('lang')?.value
  if (c === 'ru' || c === 'en') return c
  return (headers().get('accept-language') ?? '').toLowerCase().includes('ru') ? 'ru' : 'en'
}
export const getT = () => makeT(getLang())
