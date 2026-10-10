'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Follow } from '@/lib/types'

type Res = { error: { message: string } | null }

// mine = my subscription to this person; theirs = this person's subscription to me
export default function FollowButton({ me, other, mine, theirs }: { me: string; other: string; mine: Follow | null; theirs: Follow | null }) {
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
    <div className="flex flex-col items-center gap-3">
      {theirs?.status === 'pending' && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-mut">Хочет подписаться на вас</span>
          <button disabled={busy} className="btn-p !px-4 !py-2" onClick={accept}>Принять заявку</button>
          <button disabled={busy} className={sm} onClick={() => del(theirs.id)}>Отклонить заявку</button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {!mine && <button disabled={busy} className="btn-p" onClick={() => run(sb.from('follows').insert({ follower: me, following: other }))}>Подписаться</button>}
        {mine?.status === 'pending' && <><span className="text-mut">Заявка отправлена</span><button disabled={busy} className={sm} onClick={() => del(mine.id)}>Отменить заявку</button></>}
        {mine?.status === 'accepted' && <><span className="font-semibold text-acc">Вы подписаны</span><button disabled={busy} className={sm} onClick={() => del(mine.id)}>Отписаться</button></>}
        {theirs?.status === 'accepted' && <button disabled={busy} className={sm} onClick={() => del(theirs.id)}>Удалить подписчика</button>}
      </div>
      {err && <p className="text-center text-sm text-red-400">{err}</p>}
    </div>
  )
}
