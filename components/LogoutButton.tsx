'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  return (
    <button className="hover:text-fg" onClick={async () => { await createClient().auth.signOut(); router.push('/'); router.refresh() }}>
      Logout
    </button>
  )
}
