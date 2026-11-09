-- Element Worlds: the family on today's element (2026-11-09; docs/knowledge/daily.md, "The family"). Who is
-- family is the admin's choice (the family dashboard's People, through ew_family_admin); a member sees the
-- other members' names and the days each did today's element, nothing else of their progress, so Artur and
-- his father see each other's day and keep a streak together. Seeded with the user's account and Artur's.
-- Applied to project kawvqpvntdgehigwvfao after ew_005_daily.sql.

create table if not exists public.ew_family (
  account uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.ew_family enable row level security;
revoke all on public.ew_family from anon, authenticated;

-- for a member: every member's name, whether it is the one asking, and the days since p_since on which each
-- did today's element (the page works out each one's streak and the family's); null for anyone else
create or replace function public.ew_family_days(p_since text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null or p_since is null or p_since !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    or not exists (select 1 from public.ew_family where account = uid) then
    return null;
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'name', coalesce(nullif(p.display_name, ''), p.username, '?'),
      'me', f.account = uid,
      'days', coalesce((select jsonb_agg(k order by k) from jsonb_object_keys(
          case when jsonb_typeof(e.progress->'daily'->'days') = 'object' then e.progress->'daily'->'days' else '{}'::jsonb end) k
        where k >= p_since), '[]'::jsonb))
    order by f.added_at, p.username)
    from public.ew_family f join public.profiles p on p.id = f.account left join public.ew_profiles e on e.id = f.account), '[]'::jsonb);
end $$;

-- the admin's (the dashboard's password, as ew_admin's, or signed in as an admin): 'list' the accounts that
-- played with whether each is family, 'set' {account, on} one in or out
create or replace function public.ew_family_admin(p_pass text, p_action text, p_args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ok boolean; acc uuid;
begin
  select (pass = extensions.crypt(coalesce(p_pass, ''), pass)) into ok from public.ew_admin_pass where id = 1;
  ok := coalesce(ok, false) or exists (select 1 from public.profiles where id = auth.uid() and is_admin);
  if not ok then
    perform pg_sleep(1.5);
    return jsonb_build_object('error', 'password');
  end if;
  if p_action = 'list' then
    return coalesce((select jsonb_agg(jsonb_build_object('id', ep.id, 'family', exists (select 1 from public.ew_family f where f.account = ep.id)))
      from public.ew_profiles ep), '[]'::jsonb);
  end if;
  if p_action = 'set' then
    acc := nullif(p_args->>'account', '')::uuid;
    if acc is null or not exists (select 1 from public.ew_profiles where id = acc) then return jsonb_build_object('error', 'account'); end if;
    if coalesce((p_args->>'on')::boolean, false) then
      insert into public.ew_family (account) values (acc) on conflict do nothing;
    else
      delete from public.ew_family where account = acc;
    end if;
    return jsonb_build_object('ok', true);
  end if;
  return jsonb_build_object('error', 'action');
end $$;

-- (Supabase grants visitors every function by default: the days are for signed-in members only)
revoke all on function public.ew_family_days(text), public.ew_family_admin(text, text, jsonb) from public;
revoke execute on function public.ew_family_days(text) from anon;
grant execute on function public.ew_family_days(text) to authenticated;
grant execute on function public.ew_family_admin(text, text, jsonb) to anon, authenticated;

-- the family at the start: the user's account and Artur's
insert into public.ew_family (account)
select id from public.profiles where username in ('miki', 'glastrierarturmon')
on conflict do nothing;
