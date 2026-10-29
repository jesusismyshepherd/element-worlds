-- Element Worlds' usage data (2026-10-29), in the family's Supabase project (pokemon-site,
-- kawvqpvntdgehigwvfao), every name prefixed ew_. docs/knowledge/usage-data.md says what is recorded and why.
--
-- Nothing here is readable with the public key: the tables have row-level security and no policies. The
-- site writes only through ew_log, ew_mark and ew_status; the dashboard (/stats) reads through ew_admin,
-- which wants the dashboard password (its bcrypt hash is in ew_admin_pass; set it with
--   update public.ew_admin_pass set pass = extensions.crypt('<new password>', extensions.gen_salt('bf', 8));
-- in the SQL editor).
--
-- Marked devices (a family member's, marked once with ?who=<name>) log under their device id, and their
-- history is kept; every other visit logs anonymously: no device id, no address, one random id per page
-- load. Events older than 180 days are deleted.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.ew_devices (
  id uuid primary key,
  label text not null,
  kind text,
  browser text,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  removed boolean not null default false
);

create table if not exists public.ew_events (
  id bigint generated always as identity primary key,
  at timestamptz not null,
  received timestamptz not null default now(),
  device uuid references public.ew_devices (id) on delete cascade,
  visit uuid not null,
  kind text not null,
  path text,
  data jsonb
);
create index if not exists ew_events_device_at on public.ew_events (device, at);
create index if not exists ew_events_at on public.ew_events (at);
create index if not exists ew_events_visit on public.ew_events (visit);

create table if not exists public.ew_admin_pass (
  id int primary key default 1 check (id = 1),
  pass text not null
);

alter table public.ew_devices enable row level security;
alter table public.ew_events enable row level security;
alter table public.ew_admin_pass enable row level security;
revoke all on public.ew_devices, public.ew_events, public.ew_admin_pass from anon, authenticated;

-- a tag as the site uses it: lower case letters, digits, - and _, at most 24
create or replace function public.ew_tag(p text) returns text
language sql immutable set search_path = public as $$
  select nullif(left(lower(regexp_replace(coalesce(p, ''), '[^a-zA-Z0-9_-]', '', 'g')), 24), '')
$$;

-- mark this device as a family member's (?who=artur), or unmark it (?who=off)
create or replace function public.ew_mark(p_device uuid, p_label text, p_kind text default null, p_browser text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare tag text := public.ew_tag(p_label);
begin
  if p_device is null or tag is null then return jsonb_build_object('marked', false); end if;
  if tag = 'off' then
    update public.ew_devices set removed = true where id = p_device;
    return jsonb_build_object('marked', false);
  end if;
  insert into public.ew_devices (id, label, kind, browser)
  values (p_device, tag, left(p_kind, 16), left(p_browser, 40))
  on conflict (id) do update set label = excluded.label, kind = excluded.kind, browser = excluded.browser,
    removed = false, last_seen = now();
  return jsonb_build_object('marked', true, 'label', tag);
end $$;

-- is this device still marked (the dashboard may have unmarked it), and as whom
create or replace function public.ew_status(p_device uuid)
returns jsonb language sql security definer set search_path = public as $$
  select coalesce(
    (select jsonb_build_object('marked', true, 'label', label) from public.ew_devices where id = p_device and not removed),
    jsonb_build_object('marked', false))
$$;

-- a batch of events: [{ at, k (kind), p (path), d (data) }]; a device that is not marked logs anonymously
create or replace function public.ew_log(p_device uuid, p_visit uuid, p_events jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare dev uuid; n integer;
begin
  if p_visit is null or jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) > 300 then return 0; end if;
  select id into dev from public.ew_devices where id = p_device and not removed;
  insert into public.ew_events (at, device, visit, kind, path, data)
  select
    case when e->>'at' ~ '^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d'
      then least(now(), greatest(now() - interval '14 days', (e->>'at')::timestamptz)) else now() end,
    dev, p_visit, left(e->>'k', 32), left(e->>'p', 120),
    case when jsonb_typeof(e->'d') = 'object' and length((e->'d')::text) <= 4000 then e->'d' end
  from jsonb_array_elements(p_events) e
  where jsonb_typeof(e) = 'object' and coalesce(e->>'k', '') <> '';
  get diagnostics n = row_count;
  if dev is not null then update public.ew_devices set last_seen = now() where id = dev; end if;
  -- keep half a year
  if random() < 0.005 then delete from public.ew_events where received < now() - interval '180 days'; end if;
  return n;
end $$;

-- the dashboard: every action wants the password
--   check | devices | retag {device, label} | remove {device} | restore {device} | forget {device}
--   forget_visit {visit} (one visit's events, a test or a mistake)
--   events {since, until, who ('anon', a tag, or null for everyone), limit}
create or replace function public.ew_admin(p_pass text, p_action text, p_args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ok boolean; dev uuid; tag text; lim integer;
begin
  select (pass = extensions.crypt(coalesce(p_pass, ''), pass)) into ok from public.ew_admin_pass where id = 1;
  if not coalesce(ok, false) then
    perform pg_sleep(1.5);
    return jsonb_build_object('error', 'password');
  end if;
  if p_action = 'check' then return jsonb_build_object('ok', true); end if;
  if p_action = 'devices' then
    return coalesce((select jsonb_agg(to_jsonb(d) - 'id' || jsonb_build_object('id', d.id,
      'events', (select count(*) from public.ew_events e where e.device = d.id)) order by d.last_seen desc)
      from public.ew_devices d), '[]'::jsonb);
  end if;
  if p_action = 'forget_visit' then
    delete from public.ew_events where visit = nullif(p_args->>'visit', '')::uuid;
    return jsonb_build_object('ok', true);
  end if;
  dev := nullif(p_args->>'device', '')::uuid;
  if p_action = 'retag' then
    tag := public.ew_tag(p_args->>'label');
    if tag is null or tag = 'off' then return jsonb_build_object('error', 'label'); end if;
    update public.ew_devices set label = tag where id = dev;
    return jsonb_build_object('ok', true);
  end if;
  if p_action = 'remove' then update public.ew_devices set removed = true where id = dev; return jsonb_build_object('ok', true); end if;
  if p_action = 'restore' then update public.ew_devices set removed = false where id = dev; return jsonb_build_object('ok', true); end if;
  if p_action = 'forget' then delete from public.ew_devices where id = dev; return jsonb_build_object('ok', true); end if;
  if p_action = 'events' then
    lim := least(greatest(coalesce((p_args->>'limit')::integer, 20000), 1), 50000);
    return coalesce((select jsonb_agg(x order by x.at) from (
      select e.at, e.kind, e.path, e.data, e.visit, e.device, d.label
      from public.ew_events e left join public.ew_devices d on d.id = e.device
      where e.at >= coalesce((p_args->>'since')::timestamptz, now() - interval '7 days')
        and e.at < coalesce((p_args->>'until')::timestamptz, now() + interval '1 day')
        and (p_args->>'who' is null
          or (p_args->>'who' = 'anon' and e.device is null)
          or (d.label = p_args->>'who'))
      order by e.at desc
      limit lim) x), '[]'::jsonb);
  end if;
  return jsonb_build_object('error', 'action');
end $$;

grant execute on function public.ew_mark(uuid, text, text, text), public.ew_status(uuid),
  public.ew_log(uuid, uuid, jsonb), public.ew_admin(text, text, jsonb) to anon, authenticated;
revoke execute on function public.ew_tag(text) from anon, authenticated;
