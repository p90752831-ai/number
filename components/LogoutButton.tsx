'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton({ className = '', children = 'Выйти' }: { className?: string; children?: React.ReactNode }) {
  const router = useRouter()
  return (
    <button className={className} onClick={async () => { await createClient().auth.signOut(); window.location.href = '/'; router.refresh() }}>
      {children}
    </button>
  )
}
