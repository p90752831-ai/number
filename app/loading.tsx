'use client'
import { useI18n } from '@/components/I18nProvider'
export default function Loading() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-4 pt-10" aria-busy="true" aria-label={t('common.loading')}>
      <div className="skel h-24 w-56" /><div className="skel h-5 w-40" /><div className="skel h-5 w-64" />
    </div>
  )
}
