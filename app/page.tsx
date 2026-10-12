import Link from 'next/link'
import SearchForm from '@/components/SearchForm'
import CopyNumber from '@/components/CopyNumber'
import Avatar from '@/components/Avatar'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n-server'
import type { Person } from '@/lib/types'

export default async function Home() {
  const { t } = getT()
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (user) {
    const { data } = await sb.from('profiles').select('number').eq('id', user.id).maybeSingle()
    const mine = (data as { number: number } | null)?.number ?? null
    const { data: ms } = await sb.from('community_members').select('community_id').eq('user_id', user.id)
    const cids = (ms ?? []).map((m: { community_id: string }) => m.community_id)
    const { data: cs } = cids.length ? await sb.from('profiles').select('id,number,name,avatar_url').in('id', cids) : { data: [] as Person[] }
    const communities = (cs ?? []) as Person[]
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <section>
          <p className="text-mut">{t('home.yournumber')}</p>
          <Link href={mine !== null ? `/${mine}` : '/dashboard'} className="num mt-2 block text-[26vw] text-acc md:text-[8.5rem]">#{mine ?? '…'}</Link>
          <div className="mt-5 flex flex-wrap gap-2">
            {mine !== null && <CopyNumber number={mine} />}
            <Link href="/dashboard" className="btn-s">{t('home.qr')}</Link>
            <Link href="/feed" className="btn-p">{t('home.open_feed')}</Link>
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">{t('home.find')}</h2>
          <SearchForm />
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t('home.communities')}</h2>
            <Link href="/communities/new" className="btn-s !px-4 !py-2 text-sm">{t('nav.create_community')}</Link>
          </div>
          {communities.length === 0
            ? <p className="text-mut">{t('home.no_communities')}</p>
            : <ul>{communities.map(c => (
                <li key={c.id} className="border-t border-line"><Link href={`/${c.number}`} className="flex items-center gap-3 py-3">
                  <Avatar url={c.avatar_url} size={44} /><span className="min-w-0 flex-1 truncate font-semibold">{c.name}</span><span className="num text-acc">#{c.number}</span>
                </Link></li>))}</ul>}
        </section>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-20">
      <section className="rise max-w-3xl pt-4">
        <div className="num text-[34vw] text-acc md:text-[11rem]">#728</div>
        <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">{t('home.title1')}<br />{t('home.title2')}</h1>
        <p className="mt-5 max-w-lg text-lg text-mut">{t('home.sub')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn-p">{t('home.get_number')}</Link>
          <Link href="/login" className="btn-s">{t('nav.login')}</Link>
        </div>
      </section>
      <section className="grid max-w-4xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="rounded-[2rem] border border-line bg-card p-8">
          <p className="text-sm text-mut">{t('home.example')}</p>
          <div className="num mt-3 text-6xl text-acc">#728</div>
          <p className="mt-4 text-xl font-bold">{t('home.example_name')}</p>
          <p className="text-mut">{t('home.example_bio')}</p>
          <div className="mt-5 flex gap-2"><span className="pill">{t('kind.telegram')}</span><span className="pill">{t('kind.website')}</span></div>
        </div>
        <ol className="flex flex-col gap-6">
          {[1, 2, 3].map(n => (
            <li key={n} className="flex gap-4"><span className="num w-8 text-3xl text-acc">{n}</span><div><h3 className="text-lg font-bold">{t(`home.step${n}_t`)}</h3><p className="text-mut">{t(`home.step${n}_d`)}</p></div></li>
          ))}
        </ol>
      </section>
      <section className="max-w-xl">
        <h2 className="mb-4 text-xl font-bold">{t('home.find')}</h2>
        <SearchForm />
      </section>
    </div>
  )
}
