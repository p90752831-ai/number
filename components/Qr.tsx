'use client'
import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function Qr({ number }: { number: number }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => { setUrl(`${window.location.origin}/${number}`) }, [number])

  const download = () => {
    const c = box.current?.querySelector('canvas')
    if (!c) return
    const a = document.createElement('a')
    a.href = c.toDataURL('image/png'); a.download = `number-${number}.png`; a.click()
  }
  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: `#${number} on NUMBER`, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <div className="card flex flex-col items-center gap-4 text-center">
      <div ref={box} className="rounded-2xl bg-white p-4">
        {url ? <QRCodeCanvas value={url} size={512} level="M" style={{ width: 200, height: 200 }} /> : <div style={{ width: 200, height: 200 }} />}
      </div>
      <p className="break-all text-sm text-mut">{url || '…'}</p>
      <div className="flex gap-2">
        <button onClick={share} className="btn-p">{copied ? 'Link copied' : 'Share profile'}</button>
        <button onClick={download} className="btn-s">Download QR</button>
      </div>
    </div>
  )
}
