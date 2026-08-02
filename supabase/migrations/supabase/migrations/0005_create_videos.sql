-- 1. Tabla videos
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null check (
    category in ('musica', 'cocina', 'idiomas', 'tecnologia', 'deporte', 'arte', 'negocios', 'bienestar', 'otro')
  ),
  video_url text not null,
  thumbnail_url text,
  duration_seconds integer not null check (duration_seconds > 0),
  status text not null default 'active' check (status in ('active', 'reported', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index videos_owner_id_idx on public.videos (owner_id);
create index videos_category_idx on public.videos (category);
create index videos_status_idx on public.videos (status);

create trigger on_videos_updated
  before update on public.videos
  for each row execute function public.handle_updated_at();

-- 2. Tabla video_reports
create table public.video_reports (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (video_id, reporter_id)
);

create index video_reports_video_id_idx on public.video_reports (video_id);

-- 3. RLS: videos
alter table public.videos enable row level security;

-- Cualquiera puede ver videos activos (catálogo público)
create policy "Active videos are viewable by everyone"
  on public.videos for select
  to anon, authenticated
  using (status = 'active');

-- El dueño siempre puede ver sus propios videos, sin importar el status
create policy "Owners can view their own videos regardless of status"
  on public.videos for select
  to authenticated
  using (auth.uid() = owner_id);

-- Un usuario solo puede insertar videos a su propio nombre
create policy "Users can insert their own videos"
  on public.videos for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Un usuario solo puede editar sus propios videos, y nunca cambiar el status
-- (el status solo lo cambia un admin, vía service_role, en el módulo de moderación futuro)
create policy "Users can update their own videos except status"
  on public.videos for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (
    auth.uid() = owner_id
    and status = (select status from public.videos where id = videos.id)
  );

-- Un usuario solo puede borrar sus propios videos
create policy "Users can delete their own videos"
  on public.videos for delete
  to authenticated
  using (auth.uid() = owner_id);

-- 4. RLS: video_reports
alter table public.video_reports enable row level security;

-- Un usuario autenticado puede reportar (crear su propio reporte)
create policy "Authenticated users can report videos"
  on public.video_reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

-- Solo el propio reportante puede ver sus reportes (no exponemos quién reportó qué a otros usuarios)
create policy "Users can view their own reports"
  on public.video_reports for select
  to authenticated
  using (auth.uid() = reporter_id);