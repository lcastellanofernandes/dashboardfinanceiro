-- Execute em um projeto Supabase de desenvolvimento. Não altera views existentes.
-- Um snapshot contém um mês de um único usuário e é escrito pelo backend/n8n.
begin;
create table if not exists public.dashboard_snapshots (
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null check (extract(day from month) = 1),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id, month)
);
alter table public.dashboard_snapshots enable row level security;
revoke all on public.dashboard_snapshots from anon, authenticated;
grant select on public.dashboard_snapshots to authenticated;
grant all on public.dashboard_snapshots to service_role;
drop policy if exists "Read own monthly snapshots" on public.dashboard_snapshots;
create policy "Read own monthly snapshots" on public.dashboard_snapshots
  for select to authenticated using ((select auth.uid()) = user_id);
commit;
-- O frontend não recebe permissão de INSERT/UPDATE/DELETE.
-- A chave service_role/secret só deve existir nas credenciais do n8n/backend.
