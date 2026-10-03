import Link from 'next/link'
import SearchForm from '@/components/SearchForm'

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pt-6">
      <div className="up">
        <div className="big text-[30vw] text-acc sm:text-[11rem]">#728</div>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tighter sm:text-6xl">Your identity.<br />In one number.</h1>
        <p className="mt-4 max-w-md text-mut">Say your number. Find your person. One number, one profile.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn-p">Get your number</Link>
          <Link href="/search" className="btn-s">Find a person</Link>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-4 text-xl font-bold">Find a person by number</h2>
        <SearchForm />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[['01', 'Register', 'Get a random unique number.'], ['02', 'Fill your profile', 'Photo, bio, links, QR.'], ['03', 'Say “I’m #728”', 'Anyone can find you.']].map(([k, t, d]) => (
          <div key={k} className="card"><span className="text-sm font-bold text-acc">{k}</span><h3 className="mt-2 font-bold">{t}</h3><p className="text-mut">{d}</p></div>
        ))}
      </div>
    </div>
  )
}
