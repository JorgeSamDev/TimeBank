-- 1. Tabla profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Trigger: crear profile automáticamente al registrarse un usuario
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Trigger: actualizar updated_at automáticamente
create function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 4. Row Level Security
alter table public.profiles enable row level security;

-- Cualquiera autenticado puede ver perfiles públicos (necesario para catálogo/autor de videos)
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Un usuario solo puede actualizar su propio perfil, y NUNCA su columna role
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));