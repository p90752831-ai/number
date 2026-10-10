export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-4 pt-10" aria-busy="true" aria-label="Загрузка">
      <div className="skel h-24 w-56" /><div className="skel h-5 w-40" /><div className="skel h-5 w-64" />
    </div>
  )
}
