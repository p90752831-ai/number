'use client'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from './I18nProvider'

export default function LogoutButton({ className = '', icon, label = true }: { className?: string; icon?: React.ReactNode; label?: boolean }) {
  const { t } = useI18n()
  return (
    <button type="button" className={className} onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }}>
      {icon}<span className={label ? 'lbl' : ''}>{t('nav.logout')}</span>
    </button>
  )
}
