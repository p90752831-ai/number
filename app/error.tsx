'use client'
import { useI18n } from '@/components/I18nProvider'
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n()
  return (
    <div className="mt-8 text-center">
      <p className="text-xl font-bold">{t('error.title')}</p>
      <p className="mt-2 text-mut">{t('error.note')}</p>
      <button onClick={reset} className="btn-p mt-6">{t('error.retry')}</button>
    </div>
  )
}
