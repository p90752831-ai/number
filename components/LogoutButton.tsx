'use client'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton({ className = '', children = 'Выйти' }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }}>
      {children}
    </button>
  )
}
