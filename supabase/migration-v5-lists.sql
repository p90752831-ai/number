-- STAGE 2-4: follower / following lists. Run once in SQL Editor (after migration-v4-all.sql). Safe to re-run.
-- Why: the follows table is private (only the two people involved can read a row), so public lists
-- need a controlled function. Access rule: open profile -> everyone; closed profile -> owner and approved followers.
create or replace function public.follow_list(uid uuid, kind text, q text default '', lim integer default 20, off integer default 0)
returns table (id uuid, number integer, name text, avatar_url text)
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); ok boolean;
begin
  select (not p.is_private) or me = p.id
         or exists (select 1 from public.follows f where f.follower = me and f.following = p.id and f.status = 'accepted')
    into ok from public.profiles p where p.id = uid;
  if not coalesce(ok, false) then return; end if;
  if kind = 'followers' then
    return query select pr.id, pr.number, pr.name, pr.avatar_url
      from public.follows f join public.profiles pr on pr.id = f.follower
      where f.following = uid and f.status = 'accepted'
        and (q = '' or pr.name ilike '%' || q || '%' or pr.number::text like q || '%')
      order by f.created_at desc limit least(lim, 50) offset greatest(off, 0);
  else
    return query select pr.id, pr.number, pr.name, pr.avatar_url
      from public.follows f join public.profiles pr on pr.id = f.following
      where f.follower = uid and f.status = 'accepted'
        and (q = '' or pr.name ilike '%' || q || '%' or pr.number::text like q || '%')
      order by f.created_at desc limit least(lim, 50) offset greatest(off, 0);
  end if;
end $$;
grant execute on function public.follow_list(uuid, text, text, integer, integer) to anon, authenticated;
