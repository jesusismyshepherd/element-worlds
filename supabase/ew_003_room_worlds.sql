-- Element Worlds: the rooms' worlds kept (2026-10-30). The user: a room holds the state of its worlds
-- even when nobody is in it, and it is distinct from each player's own (saved on the device and in the
-- account's progress, below). One row per room, world and thing (`part`): its state as the last change
-- left it, with the version and who wrote it (src/net/shared.js: the higher (v, by) wins), and when.
-- Reached only through the two functions; whoever has a room's code is in the room, so the code is the
-- key. docs/knowledge/multiplayer.md, "Shared world objects". Applied to project kawvqpvntdgehigwvfao after
-- ew_002_accounts.sql.

create table if not exists public.ew_room_world (
  code text not null,
  path text not null,
  part text not null,
  v integer not null,
  by text collate "C" not null default '',
  s jsonb not null,
  at timestamptz not null default now(),
  primary key (code, path, part)
);
alter table public.ew_room_world enable row level security;
revoke all on public.ew_room_world from anon, authenticated;

-- a room's world: every thing's state, version, writer and how many seconds ago it was written (the
-- page runs forward what unfolds over time, the balloons' flight)
create or replace function public.ew_room_world_get(p_code text, p_path text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('part', part, 'v', v, 'by', by, 's', s,
    'ago', round(extract(epoch from now() - at)::numeric, 1))), '[]'::jsonb)
  from public.ew_room_world where code = p_code and path = p_path
$$;

-- one thing's new state, kept only if it is newer than the one there; small and well-formed only
-- (64 things a world, a few thousand characters each, the table never past about 200 000 rows)
create or replace function public.ew_room_world_put(p_code text, p_path text, p_part text, p_v integer, p_by text, p_s jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if p_code is null or p_code !~ '^[A-Z0-9]{4,6}$' or p_path is null or p_path !~ '^/[A-Za-z0-9/_-]{1,79}$'
    or p_part is null or p_part !~ '^[A-Za-z0-9_-]{1,40}$' or p_v is null or p_v < 1
    or coalesce(p_by, '') !~ '^[a-z0-9]{0,24}$' or jsonb_typeof(p_s) <> 'object' or length(p_s::text) > 8000 then
    return false;
  end if;
  if not exists (select 1 from public.ew_room_world where code = p_code and path = p_path and part = p_part) then
    select count(*) into n from public.ew_room_world where code = p_code and path = p_path;
    if n >= 64 or (select reltuples from pg_class where oid = 'public.ew_room_world'::regclass) > 200000 then return false; end if;
  end if;
  insert into public.ew_room_world as w (code, path, part, v, by, s, at)
  values (p_code, p_path, p_part, p_v, coalesce(p_by, ''), p_s, now())
  on conflict (code, path, part) do update set v = excluded.v, by = excluded.by, s = excluded.s, at = now()
  where (excluded.v, excluded.by) > (w.v, w.by);
  return found;
end $$;

grant execute on function public.ew_room_world_get(text, text), public.ew_room_world_put(text, text, text, integer, text, jsonb)
  to anon, authenticated;

-- each player's own worlds in the account's progress: { path: { at, parts } }, the newer of the device's
-- and the account's for each world (the rest as in ew_002_accounts.sql)
create or replace function public.ew_save_progress(p jsonb, p_first boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); old jsonb; merged jsonb;
begin
  if uid is null or jsonb_typeof(p) <> 'object' then return null; end if;
  insert into public.ew_profiles (id) values (uid) on conflict (id) do nothing;
  select progress into old from public.ew_profiles where id = uid for update;
  merged := jsonb_build_object(
    'found', coalesce((select jsonb_agg(x order by x) from (
        select jsonb_array_elements_text(case when jsonb_typeof(old->'found') = 'array' then old->'found' else '[]'::jsonb end) as x
        union
        select jsonb_array_elements_text(case when jsonb_typeof(p->'found') = 'array' then p->'found' else '[]'::jsonb end)
      ) u where length(x) between 1 and 80), '[]'::jsonb),
    'quiz', coalesce((select jsonb_object_agg(k, m) from (
        select k, max(v) as m from (
          select key as k, (value #>> '{}')::numeric as v from jsonb_each(case when jsonb_typeof(old->'quiz') = 'object' then old->'quiz' else '{}'::jsonb end) where jsonb_typeof(value) = 'number'
          union all
          select key, (value #>> '{}')::numeric from jsonb_each(case when jsonb_typeof(p->'quiz') = 'object' then p->'quiz' else '{}'::jsonb end) where jsonb_typeof(value) = 'number'
        ) a group by k) b), '{}'::jsonb),
    'neon', (case when jsonb_typeof(old->'neon') = 'object' then old->'neon' else '{}'::jsonb end)
      || (case when jsonb_typeof(p->'neon') = 'object' then p->'neon' else '{}'::jsonb end),
    'worlds', coalesce((select jsonb_object_agg(k, val) from (
        select distinct on (k) k, val from (
          select key as k, value as val, 0 as mine from jsonb_each(case when jsonb_typeof(old->'worlds') = 'object' then old->'worlds' else '{}'::jsonb end)
          union all
          select key, value, 1 from jsonb_each(case when jsonb_typeof(p->'worlds') = 'object' then p->'worlds' else '{}'::jsonb end)
        ) a where jsonb_typeof(val) = 'object' and length(k) <= 80 and length(val::text) <= 20000
        order by k, case when jsonb_typeof(val->'at') = 'number' then (val->>'at')::numeric else 0 end desc, mine desc) b), '{}'::jsonb));
  if length(merged::text) > 200000 then return old; end if;
  update public.ew_profiles set progress = merged, updated_at = now(),
    migrated_at = case when p_first and migrated_at is null then now() else migrated_at end
  where id = uid;
  return merged;
end $$;
