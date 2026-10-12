'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Follow } from '@/lib/types'
import { useI18n } from './I18nProvider'

type Res = { error: { message: string } | null }

// mine = my subscription to this profile; theirs = this profile's subscription to me (or a request to a community I manage)
// compact = only show the incoming-request actions (used in community management)
export default function FollowButton({ me, other, mine, theirs, compact = false, canRemove = true }: { me: string; other: string; mine: Follow | null; theirs: Follow | null; compact?: boolean; canRemove?: boolean }) {
  const { t } = useI18n()
  const sb = createClient()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function run(p: PromiseLike<Res>) {
    setBusy(true); setErr('')
    const { error } = await p
    setBusy(false)
    if (error) setErr(error.message); else router.refresh()
  }
  const del = (id: string | undefined) => { if (id) run(sb.from('follows').delete().eq('id', id)) }
  const accept = () => { if (theirs) run(sb.from('follows').update({ status: 'accepted' }).eq('id', theirs.id)) }
  const sm = 'btn-s !px-4 !py-2 text-sm'
  return (
    <div className="flex flex-col items-start gap-3">
      {theirs?.status === 'pending' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-mut">{t('follow.wants')}</span>
          <button disabled={busy} className="btn-p !px-4 !py-2" onClick={accept}>{t('follow.accept')}</button>
          <button disabled={busy} className={sm} onClick={() => del(theirs.id)}>{t('follow.decline')}</button>
        </div>
      )}
      {!compact && (
        <div className="flex flex-wrap items-center gap-2">
          {!mine && <button disabled={busy} className="btn-p" onClick={() => run(sb.from('follows').insert({ follower: me, following: other }))}>{t('follow.follow')}</button>}
          {mine?.status === 'pending' && <><span className="text-mut">{t('follow.sent')}</span><button disabled={busy} className={sm} onClick={() => del(mine.id)}>{t('follow.cancel')}</button></>}
          {mine?.status === 'accepted' && <><span className="font-semibold text-acc">{t('follow.following')}</span><button disabled={busy} className={sm} onClick={() => del(mine.id)}>{t('follow.unfollow')}</button></>}
          {canRemove && theirs?.status === 'accepted' && <button disabled={busy} className={sm} onClick={() => del(theirs.id)}>{t('follow.remove')}</button>}
        </div>
      )}
      {err && <p className="text-sm text-err">{err}</p>}
    </div>
  )
}
