-- 1. Columna de "primera vista gratis"
alter table public.profiles
  add column has_used_free_view boolean not null default false;

-- 2. Tabla de transacciones de crédito (ledger)
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_hours numeric(10, 4) not null,
  type text not null check (type in ('video_upload', 'video_view', 'free_view')),
  video_id uuid references public.videos(id) on delete set null,
  created_at timestamptz not null default now()
);

create index credit_transactions_user_id_idx on public.credit_transactions (user_id);

-- 3. RLS
alter table public.credit_transactions enable row level security;

-- Un usuario solo puede ver sus propias transacciones (su historial)
create policy "Users can view their own transactions"
  on public.credit_transactions for select
  to authenticated
  using (auth.uid() = user_id);

-- IMPORTANTE: no hay policy de INSERT/UPDATE/DELETE para 'authenticated'.
-- Esto significa que un usuario normal NO PUEDE escribir en esta tabla directamente,
-- ni siquiera intentando manipular el cliente desde el navegador.
-- Solo se escribe vía Server Actions usando el cliente de servidor con privilegios
-- (ver nota de seguridad abajo).
