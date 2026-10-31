-- The studio on the game's own site (2026-10-31): the user wanted the studio shared with Artur, who has
-- no Claude account, and to know who made each input. The family's accounts (the pokemon-site's logins,
-- ew_002_accounts.sql) sign in at /studio; each idea, note on an item and verdict is kept with its
-- account. Claude reads them and answers (reply, replied_at) with the Supabase MCP, as the routine says
-- (docs/knowledge/update-dashboard.md). Applied to project kawvqpvntdgehigwvfao after ew_003.

create table if not exists public.ew_studio_notes (
  id bigint generated always as identity primary key,
  account uuid not null references auth.users (id) on delete cascade,
  -- idea: a new idea; note: about an item (or the studio when item is null); verdict: first, later or no
  kind text not null check (kind in ('idea', 'note', 'verdict')),
  item text,
  value text,
  text text not null default '',
  created_at timestamptz not null default now(),
  reply text,
  replied_at timestamptz
);
create index if not exists ew_studio_notes_at on public.ew_studio_notes (created_at);
create index if not exists ew_studio_notes_account on public.ew_studio_notes (account, created_at);
alter table public.ew_studio_notes enable row level security;
revoke all on public.ew_studio_notes from anon, authenticated;

-- post an idea, a note or a verdict as the signed-in account
create or replace function public.ew_studio_post(p_kind text, p_item text, p_text text, p_value text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r public.ew_studio_notes;
begin
  if uid is null then return null; end if;
  if p_kind is null or p_kind not in ('idea', 'note', 'verdict') then return jsonb_build_object('error', 'kind'); end if;
  if p_kind = 'verdict' and (coalesce(p_item, '') = '' or coalesce(p_value, '') not in ('first', 'later', 'no')) then
    return jsonb_build_object('error', 'verdict');
  end if;
  if p_kind <> 'verdict' and length(trim(coalesce(p_text, ''))) = 0 then return jsonb_build_object('error', 'empty'); end if;
  if length(coalesce(p_text, '')) > 4000 or length(coalesce(p_item, '')) > 80 then return jsonb_build_object('error', 'long'); end if;
  -- a flood guard: at most 60 a hour from one account
  if (select count(*) from public.ew_studio_notes where account = uid and created_at > now() - interval '1 hour') >= 60 then
    return jsonb_build_object('error', 'slow');
  end if;
  insert into public.ew_studio_notes (account, kind, item, value, text)
  values (uid, p_kind, nullif(p_item, ''), p_value, coalesce(p_text, ''))
  returning * into r;
  return (to_jsonb(r) - 'account') || jsonb_build_object('username', (select username from public.profiles where id = uid), 'mine', true);
end $$;

-- what the signed-in account may read: its own notes and their answers; an admin (the user) reads everyone's
create or replace function public.ew_studio_list()
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); adm boolean;
begin
  if uid is null then return null; end if;
  adm := coalesce((select is_admin from public.profiles where id = uid), false);
  return coalesce((
    select jsonb_agg((to_jsonb(n) - 'account') || jsonb_build_object('username', p.username, 'mine', n.account = uid)
                     order by n.created_at)
    from public.ew_studio_notes n left join public.profiles p on p.id = n.account
    where adm or n.account = uid), '[]'::jsonb);
end $$;

grant execute on function public.ew_studio_post(text, text, text, text), public.ew_studio_list() to anon, authenticated;
