-- Element Worlds: today's element in the account (2026-11-09; src/game/daily.js, docs/knowledge/daily.md).
-- The account's progress gets `daily`: the days a lesson was done ({ day: { s, r, n, at } }), the boxes
-- that space the elements out ({ symbol: { b, d, at } }) and the guesses at a day's mystery element
-- ({ day: z }). Days are joined (for a day in both, the account's first one stays), each element's box is
-- the newer one (`at`), guesses are joined (the device's for a day in both). The streak is worked out on
-- the device from the days, so joining them is all two devices need. The rest as in ew_003_room_worlds.sql.
-- Applied to project kawvqpvntdgehigwvfao after ew_004_studio.sql (`create or replace` keeps the grants of
-- ew_002_accounts.sql).

create or replace function public.ew_save_progress(p jsonb, p_first boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); old jsonb; merged jsonb; od jsonb; pd jsonb;
begin
  if uid is null or jsonb_typeof(p) <> 'object' then return null; end if;
  insert into public.ew_profiles (id) values (uid) on conflict (id) do nothing;
  select progress into old from public.ew_profiles where id = uid for update;
  od := case when jsonb_typeof(old->'daily') = 'object' then old->'daily' else '{}'::jsonb end;
  pd := case when jsonb_typeof(p->'daily') = 'object' then p->'daily' else '{}'::jsonb end;
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
        order by k, case when jsonb_typeof(val->'at') = 'number' then (val->>'at')::numeric else 0 end desc, mine desc) b), '{}'::jsonb),
    'daily', jsonb_build_object(
      'days', coalesce((select jsonb_object_agg(k, val) from (
          select distinct on (k) k, val from (
            select key as k, value as val, 0 as mine from jsonb_each(case when jsonb_typeof(od->'days') = 'object' then od->'days' else '{}'::jsonb end)
            union all
            select key, value, 1 from jsonb_each(case when jsonb_typeof(pd->'days') = 'object' then pd->'days' else '{}'::jsonb end)
          ) a where k ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' and jsonb_typeof(val) = 'object' and length(val::text) <= 200
          order by k, mine) b), '{}'::jsonb),
      'boxes', coalesce((select jsonb_object_agg(k, val) from (
          select distinct on (k) k, val from (
            select key as k, value as val, 0 as mine from jsonb_each(case when jsonb_typeof(od->'boxes') = 'object' then od->'boxes' else '{}'::jsonb end)
            union all
            select key, value, 1 from jsonb_each(case when jsonb_typeof(pd->'boxes') = 'object' then pd->'boxes' else '{}'::jsonb end)
          ) a where k ~ '^[A-Z][a-z]{0,2}$' and jsonb_typeof(val) = 'object' and length(val::text) <= 200
          order by k, case when jsonb_typeof(val->'at') = 'number' then (val->>'at')::numeric else 0 end desc, mine desc) b), '{}'::jsonb),
      'guess', coalesce((select jsonb_object_agg(k, val) from (
          select distinct on (k) k, val from (
            select key as k, value as val, 0 as mine from jsonb_each(case when jsonb_typeof(od->'guess') = 'object' then od->'guess' else '{}'::jsonb end)
            union all
            select key, value, 1 from jsonb_each(case when jsonb_typeof(pd->'guess') = 'object' then pd->'guess' else '{}'::jsonb end)
          ) a where k ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' and jsonb_typeof(val) = 'number'
          order by k, mine desc) b), '{}'::jsonb)));
  if length(merged::text) > 200000 then return old; end if;
  update public.ew_profiles set progress = merged, updated_at = now(),
    migrated_at = case when p_first and migrated_at is null then now() else migrated_at end
  where id = uid;
  return merged;
end $$;
