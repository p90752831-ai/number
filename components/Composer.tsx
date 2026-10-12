'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Icon from './Icon'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function Composer({ me }: { me: string }) {
  const sb = createClient()
  const router = useRouter()
  const area = useRef<HTMLTextAreaElement>(null)
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const grow = () => { const el = area.current; if (!el) return; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 320) + 'px' }
  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!TYPES.includes(f.type)) return setErr('Фото: JPG, PNG или WebP.')
    if (f.size > 3 * 1024 * 1024) return setErr('Фото должно быть меньше 3 МБ.')
    setErr(''); setFile(f)
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!body.trim() && !file) return
    setBusy(true); setErr('')
    let image_url: string | null = null
    if (file) {
      const path = `${me}/${crypto.randomUUID()}.${file.type.split('/')[1]}`
      const up = await sb.storage.from('posts').upload(path, file, { contentType: file.type })
      if (up.error) { setBusy(false); return setErr(`Не удалось загрузить фото: ${up.error.message}`) }
      image_url = sb.storage.from('posts').getPublicUrl(path).data.publicUrl
    }
    const { error } = await sb.from('posts').insert({ user_id: me, body: body.trim(), image_url })
    setBusy(false)
    if (error) return setErr(`Не удалось опубликовать: ${error.message}`)
    setBody(''); setFile(null); if (area.current) area.current.style.height = 'auto'
    router.refresh()
  }
  // Root cause of the clipped first letter: the textarea used the rounded input style (rounded-2xl) with its padding forced
  // to 0, so the rounded corner cut the first glyph. Now the rounded, padded container is the field; the textarea is bare.
  return (
    <form onSubmit={submit} className="field flex flex-col gap-3 rounded-3xl p-4">
      <textarea ref={area} rows={2} maxLength={2000} value={body} onChange={e => { setBody(e.target.value); grow() }}
        placeholder="Что нового?" aria-label="Текст записи" className="bare block w-full resize-none text-base leading-relaxed" />
      {file && <p className="flex items-center gap-2 text-sm text-mut"><span className="truncate">{file.name}</span><button type="button" className="underline hover:text-fg" onClick={() => setFile(null)}>убрать</button></p>}
      {err && <p role="alert" className="text-sm text-err">{err}</p>}
      <div className="flex items-center justify-between">
        <label className="btn-s cursor-pointer !px-4 !py-2 text-sm">Фото<input type="file" accept={TYPES.join(',')} onChange={pick} className="hidden" /></label>
        <button className="btn-p !py-2" disabled={busy || (!body.trim() && !file)}>{busy ? 'Публикуем…' : 'Опубликовать'}</button>
      </div>
    </form>
  )
}
