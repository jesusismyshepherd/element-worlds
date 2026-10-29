-- Element Worlds accounts (2026-10-29): the family Supabase project's own accounts (the pokemon-site's:
-- a username and a password, the address <username>@pokemon-app.internal, the profile made by its
-- trigger), so one login works on both sites. The user: accounts instead of the ?who= tags, everyone
-- signed in recorded (a switch in their account turns it off; on by default), and what a device already
-- holds (discoveries, badges, records) moved into the first account that signs in on it.
-- docs/knowledge/accounts.md. Applied to project kawvqpvntdgehigwvfao after ew_001_usage.sql.

-- an account's Element Worlds side: the recording switch and the progress (discoveries, quiz records,
-- neon names); reached only through the functions below
create table if not exists public.ew_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tracking boolean not null default true,
  progress jsonb not null default '{}'::jsonb,
  migrated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.ew_profiles enable row level security;
revoke all on public.ew_profiles from anon, authenticated;

-- events: the account instead of a marked device (no device was ever marked; the tags are gone)
alter table public.ew_events add column if not exists account uuid references auth.users (id) on delete cascade;
create index if not exists ew_events_account_at on public.ew_events (account, at);
alter table public.ew_events drop column if exists device;
drop function if exists public.ew_mark(uuid, text, text, text);
drop function if exists public.ew_status(uuid);
drop table if exists public.ew_devices;

-- me: my switch, my progress, my username, whether I am an admin (my row made on first call)
create or replace function public.ew_me()
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r public.ew_profiles;
begin
  if uid is null then return null; end if;
  insert into public.ew_profiles (id) values (uid) on conflict (id) do nothing;
  select * into r from public.ew_profiles where id = uid;
  return jsonb_build_object('tracking', r.tracking, 'progress', r.progress, 'migrated', r.migrated_at is not null,
    'username', (select username from public.profiles where id = uid),
    'admin', coalesce((select is_admin from public.profiles where id = uid), false));
end $$;

create or replace function public.ew_set_tracking(p_on boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return null; end if;
  insert into public.ew_profiles (id, tracking) values (uid, coalesce(p_on, true))
  on conflict (id) do update set tracking = coalesce(p_on, true), updated_at = now();
  return jsonb_build_object('tracking', coalesce(p_on, true));
end $$;

-- my progress merged with what this device holds: discoveries joined, the best quiz record kept, the
-- device's neon names over the account's; p_first marks the first move from a device into the account
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
      || (case when jsonb_typeof(p->'neon') = 'object' then p->'neon' else '{}'::jsonb end));
  if length(merged::text) > 200000 then return old; end if;
  update public.ew_profiles set progress = merged, updated_at = now(),
    migrated_at = case when p_first and migrated_at is null then now() else migrated_at end
  where id = uid;
  return merged;
end $$;

-- a batch of events; signed in (and recording on): under the account, else anonymously
create or replace function public.ew_log(p_visit uuid, p_events jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); n integer;
begin
  if p_visit is null or jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) > 300 then return 0; end if;
  -- an account that switched the recording off: nothing at all
  if uid is not null and exists (select 1 from public.ew_profiles where id = uid and not tracking) then return 0; end if;
  insert into public.ew_events (at, account, visit, kind, path, data)
  select
    case when e->>'at' ~ '^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d'
      then least(now(), greatest(now() - interval '14 days', (e->>'at')::timestamptz)) else now() end,
    uid, p_visit, left(e->>'k', 32), left(e->>'p', 120),
    case when jsonb_typeof(e->'d') = 'object' and length((e->'d')::text) <= 4000 then e->'d' end
  from jsonb_array_elements(p_events) e
  where jsonb_typeof(e) = 'object' and coalesce(e->>'k', '') <> '';
  get diagnostics n = row_count;
  if random() < 0.005 then delete from public.ew_events where received < now() - interval '180 days'; end if;
  return n;
end $$;
-- the pages still open from before (they send a device id first): the same, the device ignored
create or replace function public.ew_log(p_device uuid, p_visit uuid, p_events jsonb)
returns integer language sql security definer set search_path = public as $$
  select public.ew_log(p_visit, p_events)
$$;

-- the dashboard: the password, or signed in as an admin (profiles.is_admin)
--   check | devices (the accounts: username, first and last seen, events, recording on/off) |
--   forget {device: an account} (its events) | forget_visit {visit} |
--   forget_probe {username: probe_...} (a probe's throwaway account, all of it) |
--   events {since, until, who ('anon', a username, or null for everyone), limit}
create or replace function public.ew_admin(p_pass text, p_action text, p_args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ok boolean; acc uuid; lim integer; who text;
begin
  select (pass = extensions.crypt(coalesce(p_pass, ''), pass)) into ok from public.ew_admin_pass where id = 1;
  ok := coalesce(ok, false) or exists (select 1 from public.profiles where id = auth.uid() and is_admin);
  if not ok then
    perform pg_sleep(1.5);
    return jsonb_build_object('error', 'password');
  end if;
  if p_action = 'check' then return jsonb_build_object('ok', true); end if;
  if p_action = 'devices' then
    return coalesce((select jsonb_agg(x order by x.last_seen desc nulls last) from (
      select ep.id, coalesce(pr.username, '?') as label,
        (select e.data->>'kind' from public.ew_events e where e.account = ep.id and e.kind = 'start' order by e.at desc limit 1) as kind,
        (select e.data->>'browser' from public.ew_events e where e.account = ep.id and e.kind = 'start' order by e.at desc limit 1) as browser,
        coalesce((select min(e.at) from public.ew_events e where e.account = ep.id), ep.created_at) as first_seen,
        (select max(e.at) from public.ew_events e where e.account = ep.id) as last_seen,
        not ep.tracking as removed,
        (select count(*) from public.ew_events e where e.account = ep.id) as events,
        jsonb_array_length(coalesce(ep.progress->'found', '[]'::jsonb)) as discoveries
      from public.ew_profiles ep left join public.profiles pr on pr.id = ep.id) x), '[]'::jsonb);
  end if;
  if p_action = 'forget_visit' then
    delete from public.ew_events where visit = nullif(p_args->>'visit', '')::uuid;
    return jsonb_build_object('ok', true);
  end if;
  if p_action = 'forget' then
    acc := nullif(p_args->>'device', '')::uuid;
    delete from public.ew_events where account = acc;
    return jsonb_build_object('ok', true);
  end if;
  if p_action = 'forget_probe' then
    who := lower(coalesce(p_args->>'username', ''));
    if who !~ '^probe_[a-z0-9_]+$' then return jsonb_build_object('error', 'not a probe'); end if;
    delete from auth.users where email = who || '@pokemon-app.internal';
    return jsonb_build_object('ok', true);
  end if;
  if p_action = 'events' then
    lim := least(greatest(coalesce((p_args->>'limit')::integer, 20000), 1), 50000);
    return coalesce((select jsonb_agg(x order by x.at) from (
      select e.at, e.kind, e.path, e.data, e.visit, e.account as device, pr.username as label
      from public.ew_events e left join public.profiles pr on pr.id = e.account
      where e.at >= coalesce((p_args->>'since')::timestamptz, now() - interval '7 days')
        and e.at < coalesce((p_args->>'until')::timestamptz, now() + interval '1 day')
        and (p_args->>'who' is null
          or (p_args->>'who' = 'anon' and e.account is null)
          or (pr.username = p_args->>'who'))
      order by e.at desc
      limit lim) x), '[]'::jsonb);
  end if;
  return jsonb_build_object('error', 'action');
end $$;

grant execute on function public.ew_me(), public.ew_set_tracking(boolean), public.ew_save_progress(jsonb, boolean),
  public.ew_log(uuid, jsonb), public.ew_log(uuid, uuid, jsonb), public.ew_admin(text, text, jsonb) to anon, authenticated;
