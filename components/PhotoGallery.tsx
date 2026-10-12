'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Icon from './Icon'
import { useI18n } from './I18nProvider'

type Photo = { id: string; image_url: string }
const N = 9

export default function PhotoGallery({ initial, userId }: { initial: Photo[]; userId: string }) {
  const { t } = useI18n()
  const sb = createClient()
  const [items, setItems] = useState<Photo[]>(initial)
  const [done, setDone] = useState(initial.length < N)
  const [busy, setBusy] = useState(false)
  const [bad, setBad] = useState<string[]>([])
  const [view, setView] = useState<Photo | null>(null)
  useEffect(() => { setItems(initial); setDone(initial.length < N) }, [initial])
  useEffect(() => {
    if (!view) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setView(null) }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [view])

  async function more() {
    setBusy(true)
    const { data } = await sb.from('posts').select('id,image_url').eq('user_id', userId).not('image_url', 'is', null)
      .order('created_at', { ascending: false }).range(items.length, items.length + N - 1)
    setBusy(false)
    const next = (data ?? []) as Photo[]
    setItems([...items, ...next]); if (next.length < N) setDone(true)
  }
  function toPost(id: string) {
    const el = document.getElementById(`post-${id}`)
    setView(null)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const shown = items.filter(p => !bad.includes(p.id))
  if (shown.length === 0) return null
  return (
    <section aria-label={t('gallery.aria')}>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {shown.map(p => (
          <button key={p.id} type="button" onClick={() => setView(p)} aria-label={t('gallery.open')} className="group relative aspect-square overflow-hidden rounded-xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image_url} alt="" loading="lazy" onError={() => setBad([...bad, p.id])} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {!done && <div className="pt-3 text-center"><button className="btn-s !py-2 text-sm" disabled={busy} onClick={more}>{busy ? t('common.loading') : t('gallery.more')}</button></div>}
      {view && (
        <div role="dialog" aria-modal="true" aria-label={t('gallery.photo')} className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4" onClick={() => setView(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={view.image_url} alt="" className="max-h-[78vh] max-w-full rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            {typeof document !== 'undefined' && document.getElementById(`post-${view.id}`) && <button className="btn-p !py-2" onClick={() => toPost(view.id)}>{t('gallery.to_post')}</button>}
            <button className="btn-s !py-2 !border-white/40 !text-white hover:!bg-white/10" onClick={() => setView(null)}><Icon n="x" size={18} />{t('common.close')}</button>
          </div>
        </div>
      )}
    </section>
  )
}
