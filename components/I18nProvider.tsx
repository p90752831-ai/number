'use client'
import { createContext, useContext } from 'react'
import { makeT, type Lang } from '@/lib/i18n'

const Ctx = createContext<Lang>('ru')
export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>
}
export const useI18n = () => makeT(useContext(Ctx))
