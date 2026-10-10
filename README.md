# NUMBER — MVP

Your identity. In one number. Next.js 14 + TypeScript + Tailwind + Supabase (Auth, Postgres, Storage).

## Архитектура
- Браузер → Next.js (страницы и сессия через cookies) → Supabase.
- **Номер выдаёт база данных**: триггер `assign_number` на `auth.users` выбирает случайное 1–100000 и вставляет в `profiles`. Колонка `number` UNIQUE: при одновременной регистрации одно и то же число получит только один, второй автоматически возьмёт другое (ловит `unique_violation`). Frontend номер не генерирует и изменить не может (триггер `guard_profile` + RLS).
- RLS: читать профили можно всем (в `profiles` нет email), менять — только свой. Фото: бакет `avatars`, до 2 МБ, JPG/PNG/WebP, каждый пишет только в свою папку.

## Маршруты
`/` · `/login` · `/register` · `/dashboard` · `/profile/edit` · `/search?n=728` · `/feed` · `/follows` · `/[number]` (например `/728`)

## ЗАПУСК С НУЛЯ

**STEP 1.** Установи Node.js 18.18+ (nodejs.org, версия LTS). Проверка: `node -v`.

**STEP 2.** Распакуй проект, например в `~/number`.

**STEP 3.** Открой терминал в этой папке: `cd ~/number`.

**STEP 4.** `npm install`

**STEP 5.** На supabase.com → New project. Запомни пароль БД, дождись создания.

**STEP 6–7.** Supabase → SQL Editor → New query. Вставь весь файл `supabase/schema.sql` → Run. Должно быть "Success". Это создаст таблицу, ограничения, RLS, триггеры выдачи номера и бакет `avatars` с политиками (**STEP 8**: Storage настраивать вручную не нужно, зайди в Storage и убедись, что бакет `avatars` есть).

**STEP 8a (важно для теста).** Authentication → Providers → Email → выключи **Confirm email** (иначе после регистрации нужно подтверждать почту). Для продакшена включи обратно.

**STEP 9.** Settings → API. Скопируй Project URL и anon public key. Создай файл `.env.local` в корне проекта:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой-anon-key
```
Никогда не используй `service_role` key во frontend.

**STEP 10.** `npm run dev`

**STEP 11.** Открой http://localhost:3000

## КАК ПРОВЕРИТЬ, ЧТО ВСЁ РАБОТАЕТ
1. **Регистрация (12):** /register → email + пароль 8+ символов → попадаешь в /dashboard.
2. **Выдача номера (13):** в dashboard виден `#номер` от 1 до 100000. В Supabase → Table Editor → profiles появилась строка с тем же number.
3. **Разные номера:** выйди (Logout), зарегистрируй второго пользователя — номер другой. Попытка вручную вставить дубль в SQL Editor: `update profiles set number = <чужой> where ...` даст ошибку.
4. **Профиль (14):** Edit profile → имя, username, bio, фото, ссылки → Save changes. Открой `/твой-номер` — всё отображается, email нигде не виден.
5. **QR (15):** на странице профиля или в dashboard → Download QR; отсканируй телефоном, откроется `/твой-номер`.
6. **Поиск (16):** на главной введи номер → View profile. Введи несвободный номер → "This number is not registered yet."
8. **Защита:** выйди и открой /dashboard → редирект на /login. Загрузи фото > 2 МБ → ошибка.

## ДЕПЛОЙ
1. **GitHub:** создай репозиторий на github.com, затем в папке проекта:
   `git init && git add . && git commit -m "NUMBER mvp" && git branch -M main && git remote add origin https://github.com/ТЫ/number.git && git push -u origin main` (`.env.local` в .gitignore, на GitHub не попадёт).
2. **Vercel:** vercel.com → Add New → Project → Import репозиторий → Framework: Next.js.
3. **Environment Variables** (до Deploy): `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` с теми же значениями → Deploy.
4. **Production Supabase:** можно использовать тот же проект или создать отдельный (повторить STEP 5–9 и подставить его ключи в Vercel).
5. **Публичный URL:** `https://название.vercel.app`. Supabase → Authentication → URL Configuration → Site URL = этот адрес (нужно для писем подтверждения).
6. **Свой домен:** Vercel → Project → Settings → Domains → Add → добавь DNS-записи у регистратора, как покажет Vercel. QR автоматически начнёт использовать новый домен.

## MVP CHECKLIST
[x] Registration  [x] Login  [x] Random number  [x] Unique number (UNIQUE + trigger)  [x] Database  [x] Profile  [x] Avatar  [x] Social links  [x] Public profile  [x] Search  [x] QR  [x] Share  [x] Mobile responsive  [x] Security (RLS, validation, upload limits)  [ ] Deployment (сделай по разделу выше)

## Дизайн-система
Шрифт Inter. Фон `#0B0B0D`, карточки `#16161A`, границы `#2A2A30`, текст `#F4F2EC`, приглушённый `#8A8A90`, акцент `#C8FF3D`. Кнопки и карточки полностью скруглены (`rounded-full` / `rounded-3xl`), номер `#728` — самый крупный элемент (`.big`). Классы: `.btn-p`, `.btn-s`, `.inp`, `.card` в `app/globals.css`.

## Примечания
- Если свободных номеров почти не останется, выдача замедлится (подбор случайных). Для 100000 мест на старте это не проблема.
- Marketplace, платежи и т.п. намеренно не реализованы.

## ВЕРСИЯ 4 (подписки, стена, лента, редизайн)
1. SQL Editor → выполни целиком `supabase/migration-v4-all.sql` (после `schema.sql`; файл можно запускать повторно). Старые колонки (username, telegram, …) не удаляются.
2. Замени файлы проекта, `npm install`, `npm run dev`, затем push.
3. Проверка (нужны 2 аккаунта): подписка на открытый профиль → «Вы подписаны»; закрытый профиль → заявка, принять на `/follows`; запись на стене и в `/feed`; комментарий; ссылка «только подписчикам» не видна без подписки; фото в записи; «Показать ещё» после 10 записей.
Торговой площадки номеров в проекте нет.
