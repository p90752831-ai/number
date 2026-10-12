import Link from 'next/link'
import SearchForm from '@/components/SearchForm'
import CopyNumber from '@/components/CopyNumber'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (user) {
    const { data } = await sb.from('profiles').select('number').eq('id', user.id).maybeSingle()
    const mine = (data as { number: number } | null)?.number ?? null
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <section>
          <p className="text-mut">Ваш номер</p>
          <Link href={mine !== null ? `/${mine}` : '/dashboard'} className="num mt-2 block text-[26vw] text-acc md:text-[8.5rem]">#{mine ?? '…'}</Link>
          <div className="mt-5 flex flex-wrap gap-2">
            {mine !== null && <CopyNumber number={mine} />}
            <Link href="/dashboard" className="btn-s">QR-код</Link>
            <Link href="/feed" className="btn-p">Открыть ленту</Link>
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">Найти человека по номеру</h2>
          <SearchForm />
        </section>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-20">
      <section className="rise max-w-3xl pt-4">
        <div className="num text-[34vw] text-acc md:text-[11rem]">#728</div>
        <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">Твоя личность.<br />В одном номере.</h1>
        <p className="mt-5 max-w-lg text-lg text-mut">Скажи «я 728», и тебя найдут. Никаких длинных юзернеймов: номер, профиль, подписки и записи.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn-p">Получить номер</Link>
          <Link href="/login" className="btn-s">Войти</Link>
        </div>
      </section>
      <section className="grid max-w-4xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="rounded-[2rem] border border-line bg-card p-8">
          <p className="text-sm text-mut">Пример профиля</p>
          <div className="num mt-3 text-6xl text-acc">#728</div>
          <p className="mt-4 text-xl font-bold">Имя Фамилия</p>
          <p className="text-mut">Пара слов о себе</p>
          <div className="mt-5 flex gap-2"><span className="pill">Telegram</span><span className="pill">Сайт</span></div>
        </div>
        <ol className="flex flex-col gap-6">
          {[['1', 'Зарегистрируйтесь', 'Нужны только почта и пароль. Номер выдаётся автоматически.'], ['2', 'Назовите номер', 'Человек вводит его в поиск и сразу попадает в ваш профиль.'], ['3', 'Подпишитесь друг на друга', 'Следите за записями, ведите стену и прячьте ссылки от посторонних.']].map(([n, t, d]) => (
            <li key={n} className="flex gap-4"><span className="num w-8 text-3xl text-acc">{n}</span><div><h3 className="text-lg font-bold">{t}</h3><p className="text-mut">{d}</p></div></li>
          ))}
        </ol>
      </section>
      <section className="max-w-xl">
        <h2 className="mb-4 text-xl font-bold">Найти человека по номеру</h2>
        <SearchForm />
      </section>
    </div>
  )
}
