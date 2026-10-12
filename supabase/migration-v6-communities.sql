-- STAGE 6: communities. Run once in SQL Editor after migration-v5-lists.sql. Safe to re-run.
-- Design: a community is a row of the SAME table as a person (profiles, kind = 'community').
-- That gives, with no duplicated mechanisms: one shared number space (the existing UNIQUE constraint,
-- so a person and a community can never share a number), and reuse of follows, posts, comments, links,
-- search, counters and lists. Roles (owner / admin) live in community_members and can only be changed
-- through the functions below (no INSERT/UPDATE/DELETE rights for clients -> nobody can make themselves admin).

do $$ begin
  if to_regclass('public.follows') is null or to_regclass('public.posts') is null then
    raise exception 'Run migration-v4-all.sql and migration-v5-lists.sql first';
  end if;
end $$;

-- 1) communities are profiles without an auth user
alter table public.profiles add column if not exists kind text not null default 'person' check (kind in ('person', 'community'));
alter table public.profiles drop constraint if exists profiles_id_fkey;
create or replace function public.cascade_profile_delete() returns trigger language plpgsql security definer set search_path = public as $$
begin delete from public.profiles where id = old.id and kind = 'person'; return old; end $$;
drop trigger if exists cascade_profile_delete on auth.users;
create trigger cascade_profile_delete after delete on auth.users for each row execute function public.cascade_profile_delete();

alter table public.profile_links drop constraint if exists profile_links_user_id_fkey;
alter table public.profile_links add constraint profile_links_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;

-- 2) roles
create table if not exists public.community_members (
  community_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin')),
  created_at timestamptz not null default now(),
  primary key (community_id, user_id)
);
create unique index if not exists one_owner on public.community_members (community_id) where role = 'owner';
alter table public.community_members enable row level security;
drop policy if exists "members are public" on public.community_members;
create policy "members are public" on public.community_members for select using (true);
revoke all on public.community_members from anon, authenticated;
grant select on public.community_members to anon, authenticated;

create or replace function public.is_community_admin(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.community_members m where m.community_id = cid and m.user_id = auth.uid() and m.role in ('owner', 'admin'))
$$;
create or replace function public.is_community_admin_text(t text) returns boolean language plpgsql stable security definer set search_path = public as $$
begin return public.is_community_admin(t::uuid); exception when others then return false; end $$;
grant execute on function public.is_community_admin(uuid), public.is_community_admin_text(text) to anon, authenticated;

-- 3) number, name and kind stay immutable
create or replace function public.guard_profile() returns trigger language plpgsql as $$
begin
  if new.number <> old.number or new.id <> old.id or new.kind <> old.kind then raise exception 'number, id and kind are immutable'; end if;
  new.updated_at = now();
  return new;
end $$;

-- 4) profiles: admins may edit their community
drop policy if exists "update community as admin" on public.profiles;
create policy "update community as admin" on public.profiles for update
  using (kind = 'community' and public.is_community_admin(id)) with check (kind = 'community' and public.is_community_admin(id));

-- 5) follows: admins of a community manage its requests and followers
drop policy if exists "see own follows" on public.follows;
drop policy if exists "approve" on public.follows;
drop policy if exists "unfollow or remove" on public.follows;
create policy "see own follows" on public.follows for select using (auth.uid() in (follower, following) or public.is_community_admin(following));
create policy "approve" on public.follows for update
  using (auth.uid() = following or public.is_community_admin(following))
  with check ((auth.uid() = following or public.is_community_admin(following)) and status = 'accepted');
create policy "unfollow or remove" on public.follows for delete using (auth.uid() in (follower, following) or public.is_community_admin(following));

-- 6) links, posts, comments
drop policy if exists "read links" on public.profile_links;
drop policy if exists "insert own links" on public.profile_links;
drop policy if exists "update own links" on public.profile_links;
drop policy if exists "delete own links" on public.profile_links;
create policy "read links" on public.profile_links for select using (
  visibility = 'public' or user_id = auth.uid() or public.is_community_admin(user_id)
  or exists (select 1 from public.follows f where f.follower = auth.uid() and f.following = profile_links.user_id and f.status = 'accepted'));
create policy "insert own links" on public.profile_links for insert with check (user_id = auth.uid() or public.is_community_admin(user_id));
create policy "update own links" on public.profile_links for update using (user_id = auth.uid() or public.is_community_admin(user_id)) with check (user_id = auth.uid() or public.is_community_admin(user_id));
create policy "delete own links" on public.profile_links for delete using (user_id = auth.uid() or public.is_community_admin(user_id));

alter table public.posts add column if not exists author_id uuid;
create or replace function public.set_post_author() returns trigger language plpgsql as $$
begin new.author_id := auth.uid(); return new; end $$;
drop trigger if exists set_post_author on public.posts;
create trigger set_post_author before insert on public.posts for each row execute function public.set_post_author();

drop policy if exists "read posts" on public.posts;
drop policy if exists "insert own posts" on public.posts;
drop policy if exists "update own posts" on public.posts;
drop policy if exists "delete own posts" on public.posts;
create policy "read posts" on public.posts for select using (
  user_id = auth.uid() or public.is_community_admin(user_id)
  or not exists (select 1 from public.profiles p where p.id = posts.user_id and p.is_private)
  or exists (select 1 from public.follows f where f.follower = auth.uid() and f.following = posts.user_id and f.status = 'accepted'));
create policy "insert own posts" on public.posts for insert with check (user_id = auth.uid() or public.is_community_admin(user_id));
create policy "update own posts" on public.posts for update using (user_id = auth.uid() or public.is_community_admin(user_id)) with check (user_id = auth.uid() or public.is_community_admin(user_id));
create policy "delete own posts" on public.posts for delete using (user_id = auth.uid() or public.is_community_admin(user_id));

drop policy if exists "delete comment" on public.comments;
create policy "delete comment" on public.comments for delete using (
  user_id = auth.uid()
  or exists (select 1 from public.posts p where p.id = comments.post_id and (p.user_id = auth.uid() or public.is_community_admin(p.user_id))));

-- 7) follower lists: admins always see them
create or replace function public.follow_list(uid uuid, kind text, q text default '', lim integer default 20, off integer default 0)
returns table (id uuid, number integer, name text, avatar_url text)
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); ok boolean;
begin
  select (not p.is_private) or me = p.id or public.is_community_admin(p.id)
         or exists (select 1 from public.follows f where f.follower = me and f.following = p.id and f.status = 'accepted')
    into ok from public.profiles p where p.id = uid;
  if not coalesce(ok, false) then return; end if;
  if kind = 'followers' then
    return query select pr.id, pr.number, pr.name, pr.avatar_url
      from public.follows f join public.profiles pr on pr.id = f.follower
      where f.following = uid and f.status = 'accepted' and (q = '' or pr.name ilike '%' || q || '%' or pr.number::text like q || '%')
      order by f.created_at desc limit least(lim, 50) offset greatest(off, 0);
  else
    return query select pr.id, pr.number, pr.name, pr.avatar_url
      from public.follows f join public.profiles pr on pr.id = f.following
      where f.follower = uid and f.status = 'accepted' and (q = '' or pr.name ilike '%' || q || '%' or pr.number::text like q || '%')
      order by f.created_at desc limit least(lim, 50) offset greatest(off, 0);
  end if;
end $$;

-- 8) storage: admins may upload to / delete from their community's folder (folder name = community id)
drop policy if exists "avatars insert own" on storage.objects;
drop policy if exists "avatars update own" on storage.objects;
drop policy if exists "avatars delete own" on storage.objects;
create policy "avatars insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_community_admin_text((storage.foldername(name))[1])));
create policy "avatars update own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_community_admin_text((storage.foldername(name))[1])));
create policy "avatars delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_community_admin_text((storage.foldername(name))[1])));
drop policy if exists "posts upload own" on storage.objects;
drop policy if exists "posts delete own" on storage.objects;
create policy "posts upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'posts' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_community_admin_text((storage.foldername(name))[1])));
create policy "posts delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'posts' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_community_admin_text((storage.foldername(name))[1])));

-- 9) functions (the only way to create a community or change roles)
create or replace function public.create_community(p_name text, p_description text default null) returns integer
language plpgsql security definer set search_path = public as $$
declare n integer; tries integer := 0; cid uuid := gen_random_uuid(); nm text := trim(coalesce(p_name, ''));
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if char_length(nm) not between 1 and 60 then raise exception 'name must be 1-60 characters'; end if;
  if (select count(*) from public.community_members where user_id = auth.uid() and role = 'owner') >= 10 then raise exception 'limit: 10 communities'; end if;
  loop
    n := 1 + floor(random() * 100000)::integer;
    begin
      insert into public.profiles (id, number, name, bio, kind) values (cid, n, nm, left(nullif(trim(coalesce(p_description, '')), ''), 240), 'community');
      exit;
    exception when unique_violation then
      tries := tries + 1;
      if tries > 500 then raise exception 'no free numbers'; end if;
    end;
  end loop;
  insert into public.community_members (community_id, user_id, role) values (cid, auth.uid(), 'owner');
  insert into public.follows (follower, following, status) values (auth.uid(), cid, 'accepted');
  return n;
end $$;

create or replace function public.add_community_admin(cid uuid, target integer) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not exists (select 1 from public.community_members where community_id = cid and user_id = auth.uid() and role = 'owner') then raise exception 'only the owner can do this'; end if;
  select id into uid from public.profiles where number = target and kind = 'person';
  if uid is null then raise exception 'person not found'; end if;
  insert into public.community_members (community_id, user_id, role) values (cid, uid, 'admin') on conflict do nothing;
end $$;

create or replace function public.remove_community_admin(cid uuid, uid uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.community_members where community_id = cid and user_id = auth.uid() and role = 'owner') then raise exception 'only the owner can do this'; end if;
  delete from public.community_members where community_id = cid and user_id = uid and role = 'admin';
end $$;

create or replace function public.delete_community(cid uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.community_members where community_id = cid and user_id = auth.uid() and role = 'owner') then raise exception 'only the owner can do this'; end if;
  delete from public.profiles where id = cid and kind = 'community';  -- cascades members, follows, posts, comments, links
end $$;
revoke execute on function public.create_community(text, text), public.add_community_admin(uuid, integer), public.remove_community_admin(uuid, uuid), public.delete_community(uuid) from public, anon;
grant execute on function public.create_community(text, text), public.add_community_admin(uuid, integer), public.remove_community_admin(uuid, uuid), public.delete_community(uuid) to authenticated;
