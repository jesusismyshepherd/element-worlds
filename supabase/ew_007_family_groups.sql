-- Element Worlds: families as groups (2026-11-09, right after ew_006_family.sql). With one family for everyone, a
-- probe's throwaway accounts joined the real one for a minute (the user's and Artur's family box would have
-- shown them). Now each member belongs to one family by name: 'home' is the family's own (the dashboard's
-- People toggle sets it), a probe puts its accounts in a family of its own ('probe_...'). A member sees only
-- their own family. Applied to project kawvqpvntdgehigwvfao.

alter table public.ew_family add column if not exists family text not null default 'home';

-- for a member: their family's members, each with whether it is the one asking and the days since p_since
-- they did today's element; null for anyone else
create or replace function public.ew_family_days(p_since text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid(); fam text;
begin
  select family into fam from public.ew_family where account = uid;
  if uid is null or fam is null or p_since is null or p_since !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    return null;
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'name', coalesce(nullif(p.display_name, ''), p.username, '?'),
      'me', f.account = uid,
      'days', coalesce((select jsonb_agg(k order by k) from jsonb_object_keys(
          case when jsonb_typeof(e.progress->'daily'->'days') = 'object' then e.progress->'daily'->'days' else '{}'::jsonb end) k
        where k >= p_since), '[]'::jsonb))
    order by f.added_at, p.username)
    from public.ew_family f join public.profiles p on p.id = f.account left join public.ew_profiles e on e.id = f.account
    where f.family = fam), '[]'::jsonb);
end $$;

-- the admin's: 'list' the accounts that played (family: in 'home'; group: the family it is in, if any),
-- 'set' {account, on, family?} (family 'home' unless named; letters, digits and _)
create or replace function public.ew_family_admin(p_pass text, p_action text, p_args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ok boolean; acc uuid; fam text;
begin
  select (pass = extensions.crypt(coalesce(p_pass, ''), pass)) into ok from public.ew_admin_pass where id = 1;
  ok := coalesce(ok, false) or exists (select 1 from public.profiles where id = auth.uid() and is_admin);
  if not ok then
    perform pg_sleep(1.5);
    return jsonb_build_object('error', 'password');
  end if;
  if p_action = 'list' then
    return coalesce((select jsonb_agg(jsonb_build_object('id', ep.id, 'family', f.family is not null and f.family = 'home', 'group', f.family))
      from public.ew_profiles ep left join public.ew_family f on f.account = ep.id), '[]'::jsonb);
  end if;
  if p_action = 'set' then
    acc := nullif(p_args->>'account', '')::uuid;
    fam := coalesce(nullif(p_args->>'family', ''), 'home');
    if acc is null or not exists (select 1 from public.ew_profiles where id = acc) or fam !~ '^[a-z0-9_]{1,40}$' then
      return jsonb_build_object('error', 'account');
    end if;
    if coalesce((p_args->>'on')::boolean, false) then
      insert into public.ew_family (account, family) values (acc, fam) on conflict (account) do update set family = excluded.family;
    else
      delete from public.ew_family where account = acc;
    end if;
    return jsonb_build_object('ok', true);
  end if;
  return jsonb_build_object('error', 'action');
end $$;

revoke execute on function public.ew_family_days(text) from anon;
