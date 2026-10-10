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
      <div className="flex flex-col gap-10">
        <section className="up">
          <p className="text-sm font-semibold tracking-widest text-mut">ВАШ НОМЕР</p>
          <Link href={mine !== null ? `/${mine}` : '/dashboard'} className="num block text-[30vw] text-acc sm:text-[10rem]">#{mine ?? '…'}</Link>
          <div className="mt-4 flex flex-wrap gap-2">
            {mine !== null && <CopyNumber number={mine} />}
            <Link href="/dashboard" className="btn-s">QR и обмен</Link>
          </div>
        </section>
        <section className="grid gap-3 sm:grid-cols-3">
          {[['/feed', 'Лента', 'Записи тех, на кого вы подписаны'], ['/follows', 'Подписки', 'Заявки, подписчики, подписки'], [mine !== null ? `/${mine}` : '/dashboard', 'Мой профиль', 'Стена и ссылки']].map(([h, t, d]) => (
            <Link key={h} href={h} className="card transition hover:bg-line"><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-mut">{d}</p></Link>
          ))}
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">Найти человека по номеру</h2>
          <SearchForm />
        </section>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-16">
      <section className="up pt-4">
        <div className="num text-[32vw] text-acc sm:text-[11rem]">#728</div>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tighter sm:text-6xl">Твоя личность.<br />В одном номере.</h1>
        <p className="mt-4 max-w-md text-lg text-mut">Скажи «я 728» — и тебя найдут. Без длинных юзернеймов: номер, профиль, подписки и записи.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn-p">Получить номер</Link>
          <Link href="/login" className="btn-s">Войти</Link>
        </div>
      </section>
      <section className="grid items-center gap-8 sm:grid-cols-2">
        <div className="card text-center" aria-label="Пример профиля">
          <p className="mb-2 text-xs tracking-widest text-mut">ПРИМЕР ПРОФИЛЯ</p>
          <div className="num text-7xl text-acc">#728</div>
          <p className="mt-2 font-bold">Имя Фамилия</p>
          <p className="text-sm text-mut">Пара слов о себе</p>
          <div className="mt-4 flex justify-center gap-2"><span className="pill">Telegram</span><span className="pill">Сайт</span></div>
        </div>
        <ol className="flex flex-col gap-5">
          {[['1', 'Зарегистрируйтесь', 'Нужны только почта и пароль — номер выдаётся автоматически.'], ['2', 'Назовите номер', 'Человек вводит его в поиск и сразу попадает в ваш профиль.'], ['3', 'Подпишитесь друг на друга', 'Следите за записями, ведите свою стену, прячьте ссылки от посторонних.']].map(([n, t, d]) => (
            <li key={n} className="flex gap-4"><span className="num text-3xl text-acc">{n}</span><div><h3 className="font-bold">{t}</h3><p className="text-mut">{d}</p></div></li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">Найти человека по номеру</h2>
        <SearchForm />
      </section>
    </div>
  )
}
