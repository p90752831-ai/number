export default function Avatar({ url, size = 40 }: { url: string | null | undefined; size?: number }) {
  const s = { width: size, height: size }
  // eslint-disable-next-line @next/next/no-img-element
  if (url) return <img src={url} alt="" style={s} className="shrink-0 rounded-full object-cover" />
  return <div style={s} className="num flex shrink-0 items-center justify-center rounded-full bg-card text-mut">#</div>
}
