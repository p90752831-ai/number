export function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const r = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' })
  if (s < 60) return 'только что'
  if (s < 3600) return r.format(-Math.floor(s / 60), 'minute')
  if (s < 86400) return r.format(-Math.floor(s / 3600), 'hour')
  return r.format(-Math.floor(s / 86400), 'day')
}
