-- NUMBER MVP schema. Paste the whole file into Supabase -> SQL Editor -> Run.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  number integer not null unique check (number between 1 and 100000),
  name text check (char_length(name) <= 60),
  username text unique check (username ~ '^[a-z0-9_]{3,20}$'),
  bio text check (char_length(bio) <= 240),
  avatar_url text check (avatar_url ~ '^https://'),
  telegram text check (char_length(telegram) <= 100),
  instagram text check (char_length(instagram) <= 100),
  vk text check (char_length(vk) <= 100),
  website text check (char_length(website) <= 200),
  links jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array' and jsonb_array_length(links) <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
-- Public profile data only (email lives in auth.users and is never exposed here)
create policy "profiles are public" on public.profiles for select using (true);
create policy "update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- No insert/delete policies: rows are created only by the signup trigger below.

-- Number and id can never change; keeps updated_at fresh.
create function public.guard_profile() returns trigger language plpgsql as $$
begin
  if new.number <> old.number or new.id <> old.id then raise exception 'number is immutable'; end if;
  new.updated_at = now();
  return new;
end $$;
create trigger guard_profile before update on public.profiles for each row execute function public.guard_profile();

-- Random number 1..100000. The UNIQUE constraint decides: if two signups pick the same
-- number at once, the loser gets unique_violation and simply tries another number.
create function public.assign_number() returns trigger language plpgsql security definer set search_path = public as $$
declare n integer; tries integer := 0;
begin
  loop
    n := 1 + floor(random() * 100000)::integer;
    begin
      insert into public.profiles (id, number) values (new.id, n);
      return new;
    exception when unique_violation then
      tries := tries + 1;
      if tries > 500 then raise exception 'no free numbers'; end if;
    end;
  end loop;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.assign_number();

-- Avatars: public bucket, 2 MB, images only; users write only to their own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp']);
create policy "avatars read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars update own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
