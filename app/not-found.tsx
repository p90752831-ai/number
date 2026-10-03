import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="card mx-auto mt-8 max-w-md text-center">
      <div className="big text-7xl text-mut">#404</div>
      <p className="mt-4 text-xl font-bold">Nothing here.</p>
      <Link href="/" className="btn-p mt-6">Back to NUMBER</Link>
    </div>
  )
}
