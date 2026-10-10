import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="mt-8 text-center">
      <div className="num text-8xl text-mut">#404</div>
      <p className="mt-4 text-xl font-bold">Такой страницы нет.</p>
      <Link href="/" className="btn-p mt-6">На главную</Link>
    </div>
  )
}
