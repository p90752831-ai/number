-- NUMBER v4: everything in ONE file. Run once in Supabase SQL Editor (after schema.sql). Safe to re-run.
-- Adds: closed profiles, follows (subscriptions), link visibility, wall posts, comments, post images.
-- Old columns (username, telegram, instagram, vk, website, links) are NOT deleted; the app just stops using them.

do $$ begin
  if to_regclass('public.profiles') is null then raise exception 'Run schema.sql first'; end if;
end $$;

-- 1) Closed profile flag
alter table public.profiles add column if not exists is_private boolean not null default false;

-- 2) Follows: follower subscribes to following
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower uuid not null references public.profiles(id) on delete cascade,
  following uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  check (follower <> following)
);
create unique index if not exists follows_pair on public.follows (follower, following);
create index if not exists follows_following on public.follows (following, status);

-- server decides the status: closed profile -> pending, open -> accepted (cannot be forged)
create or replace function public.set_follow_status() returns trigger language plpgsql as $$
begin
  new.status := case when exists (select 1 from public.profiles p where p.id = new.following and p.is_private)
                     then 'pending' else 'accepted' end;
  return new;
end $$;
drop trigger if exists set_follow_status on public.follows;
create trigger set_follow_status before insert on public.follows for each row execute function public.set_follow_status();

alter table public.follows enable row level security;
drop policy if exists "see own follows" on public.follows;
drop policy if exists "follow" on public.follows;
drop policy if exists "approve" on public.follows;
drop policy if exists "unfollow or remove" on public.follows;
create policy "see own follows" on public.follows for select using (auth.uid() in (follower, following));
create policy "follow" on public.follows for insert with check (auth.uid() = follower and follower <> following);
create policy "approve" on public.follows for update using (auth.uid() = following) with check (auth.uid() = following and status = 'accepted');
create policy "unfollow or remove" on public.follows for delete using (auth.uid() in (follower, following));
revoke update on public.follows from authenticated, anon;
grant update (status) on public.follows to authenticated;

-- opening a closed profile approves pending requests
create or replace function public.accept_pending_when_opened() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.is_private and not new.is_private then
    update public.follows set status = 'accepted' where following = new.id and status = 'pending';
  end if;
  return new;
end $$;
drop trigger if exists accept_pending_when_opened on public.profiles;
create trigger accept_pending_when_opened after update of is_private on public.profiles
  for each row execute function public.accept_pending_when_opened();

-- public counters (numbers only)
create or replace function public.follow_counts(uid uuid) returns table (followers bigint, following bigint)
language sql stable security definer set search_path = public as $$
  select (select count(*) from public.follows where following = uid and status = 'accepted'),
         (select count(*) from public.follows where follower = uid and status = 'accepted')
$$;
grant execute on function public.follow_counts(uuid) to anon, authenticated;

-- 3) Links with per-link visibility ('public' | 'followers')
create table if not exists public.profile_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('telegram','instagram','vk','website','other')),
  label text check (char_length(label) <= 30),
  url text not null check (char_length(url) <= 200),
  visibility text not null default 'public' check (visibility in ('public','followers')),
  position integer not null default 0
);
create index if not exists profile_links_user on public.profile_links (user_id);
alter table public.profile_links enable row level security;
drop policy if exists "read links" on public.profile_links;
drop policy if exists "insert own links" on public.profile_links;
drop policy if exists "update own links" on public.profile_links;
drop policy if exists "delete own links" on public.profile_links;
create policy "read links" on public.profile_links for select using (
  visibility = 'public' or user_id = auth.uid()
  or exists (select 1 from public.follows f where f.follower = auth.uid() and f.following = profile_links.user_id and f.status = 'accepted')
);
create policy "insert own links" on public.profile_links for insert with check (user_id = auth.uid());
create policy "update own links" on public.profile_links for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own links" on public.profile_links for delete using (user_id = auth.uid());

create or replace function public.limit_links() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.profile_links where user_id = new.user_id) >= 10 then raise exception 'max 10 links'; end if;
  return new;
end $$;
drop trigger if exists limit_links on public.profile_links;
create trigger limit_links before insert on public.profile_links for each row execute function public.limit_links();

-- copy old links once (only if the new table is empty)
do $$ begin
  if not exists (select 1 from public.profile_links) then
    insert into public.profile_links (user_id, kind, url) select id, 'telegram', trim(telegram) from public.profiles where coalesce(trim(telegram), '') <> '';
    insert into public.profile_links (user_id, kind, url) select id, 'instagram', trim(instagram) from public.profiles where coalesce(trim(instagram), '') <> '';
    insert into public.profile_links (user_id, kind, url) select id, 'vk', trim(vk) from public.profiles where coalesce(trim(vk), '') <> '';
    insert into public.profile_links (user_id, kind, url) select id, 'website', trim(website) from public.profiles where coalesce(trim(website), '') <> '';
    insert into public.profile_links (user_id, kind, label, url)
      select p.id, 'other', left(coalesce(l->>'label', ''), 30), l->>'url'
      from public.profiles p, jsonb_array_elements(p.links) l where coalesce(l->>'url', '') <> '';
  end if;
end $$;

-- 4) Wall posts. Visible: to everyone for open profiles; for closed profiles only to the owner and approved followers.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null default '' check (char_length(body) <= 2000),
  image_url text check (image_url ~ '^https://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(body) > 0 or image_url is not null)
);
create index if not exists posts_user_created on public.posts (user_id, created_at desc);
alter table public.posts enable row level security;
drop policy if exists "read posts" on public.posts;
drop policy if exists "insert own posts" on public.posts;
drop policy if exists "update own posts" on public.posts;
drop policy if exists "delete own posts" on public.posts;
create policy "read posts" on public.posts for select using (
  user_id = auth.uid()
  or not exists (select 1 from public.profiles p where p.id = posts.user_id and p.is_private)
  or exists (select 1 from public.follows f where f.follower = auth.uid() and f.following = posts.user_id and f.status = 'accepted')
);
create policy "insert own posts" on public.posts for insert with check (user_id = auth.uid());
create policy "update own posts" on public.posts for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own posts" on public.posts for delete using (user_id = auth.uid());
create or replace function public.touch_post() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists touch_post on public.posts;
create trigger touch_post before update on public.posts for each row execute function public.touch_post();

-- 5) Comments: visible wherever the post is visible (the subquery respects post RLS)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists comments_post on public.comments (post_id, created_at);
alter table public.comments enable row level security;
drop policy if exists "read comments" on public.comments;
drop policy if exists "add comment" on public.comments;
drop policy if exists "delete comment" on public.comments;
create policy "read comments" on public.comments for select using (exists (select 1 from public.posts p where p.id = comments.post_id));
create policy "add comment" on public.comments for insert with check (user_id = auth.uid() and exists (select 1 from public.posts p where p.id = comments.post_id));
create policy "delete comment" on public.comments for delete using (
  user_id = auth.uid() or exists (select 1 from public.posts p where p.id = comments.post_id and p.user_id = auth.uid())
);

-- 6) Post images. No SELECT policy on purpose: files can be opened only by their unguessable URL
-- (stored in posts, which RLS protects), and cannot be listed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posts', 'posts', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
drop policy if exists "posts upload own" on storage.objects;
drop policy if exists "posts delete own" on storage.objects;
create policy "posts upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'posts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "posts delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'posts' and (storage.foldername(name))[1] = auth.uid()::text);
