'use client'
import { useState } from 'react'

export default function CopyNumber({ number, compact = false }: { number: number; compact?: boolean }) {
  const [ok, setOk] = useState(false)
  return (
    <button type="button" className={compact ? 'rounded-full border border-line px-3 py-1 text-xs font-medium text-mut transition hover:text-fg' : 'btn-s'} aria-live="polite" onClick={async () => {
      try { await navigator.clipboard.writeText(`#${number}`); setOk(true); setTimeout(() => setOk(false), 1800) } catch {}
    }}>{ok ? 'Скопировано ✓' : 'Скопировать'}</button>
  )
}
