-- 1. Tabla public_profiles (perfil público, separada de "profiles" que es solo login/auth)
create table public.public_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  bio text,
  city text,
  skills text[] not null default '{}',
  hours numeric(10, 2) not null default 0,
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Username: solo letras, números, guion y guion bajo (útil para la URL /perfil/[username])
alter table public.public_profiles
  add constraint username_format check (username ~ '^[a-z0-9_-]{3,30}$');

create index public_profiles_username_idx on public.public_profiles (username);

-- 2. Tabla profile_videos (videos que sube el usuario a su perfil)
create table public.profile_videos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.public_profiles(id) on delete cascade,
  title text not null,
  video_url text not null,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create index profile_videos_profile_id_idx on public.profile_videos (profile_id);

-- 3. Trigger: actualizar updated_at automáticamente (reutiliza la función que ya existe)
create trigger on_public_profiles_updated
  before update on public.public_profiles
  for each row execute function public.handle_updated_at();

-- 4. Row Level Security
alter table public.public_profiles enable row level security;
alter table public.profile_videos enable row level security;

-- Perfil público: lo puede ver cualquiera, con o sin sesión
create policy "Public profiles are viewable by everyone"
  on public.public_profiles for select
  to anon, authenticated
  using (true);

-- Un usuario solo puede crear su propio perfil público
create policy "Users can create their own public profile"
  on public.public_profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Un usuario solo puede editar su propio perfil público
create policy "Users can update their own public profile"
  on public.public_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Un usuario solo puede borrar su propio perfil público
create policy "Users can delete their own public profile"
  on public.public_profiles for delete
  to authenticated
  using (auth.uid() = id);

-- Videos: visibles para cualquiera
create policy "Profile videos are viewable by everyone"
  on public.profile_videos for select
  to anon, authenticated
  using (true);

-- Videos: el dueño del perfil puede subir/editar/borrar sus propios videos
create policy "Users can insert their own videos"
  on public.profile_videos for insert
  to authenticated
  with check (
    auth.uid() = (select id from public.public_profiles where id = profile_id)
  );

create policy "Users can update their own videos"
  on public.profile_videos for update
  to authenticated
  using (
    auth.uid() = (select id from public.public_profiles where id = profile_id)
  )
  with check (
    auth.uid() = (select id from public.public_profiles where id = profile_id)
  );

create policy "Users can delete their own videos"
  on public.profile_videos for delete
  to authenticated
  using (
    auth.uid() = (select id from public.public_profiles where id = profile_id)
  );
