'use client'
import { useState } from 'react'

export default function CopyNumber({ number }: { number: number }) {
  const [ok, setOk] = useState(false)
  return (
    <button className="btn-s" aria-live="polite" onClick={async () => {
      try { await navigator.clipboard.writeText(`#${number}`); setOk(true); setTimeout(() => setOk(false), 1800) } catch {}
    }}>{ok ? 'Скопировано ✓' : 'Скопировать номер'}</button>
  )
}
