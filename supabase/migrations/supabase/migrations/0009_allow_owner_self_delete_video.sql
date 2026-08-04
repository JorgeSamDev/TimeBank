drop policy "Users can update their own videos except status" on public.videos;

create policy "Users can update their own videos, only self-delete allowed on status"
  on public.videos for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (
    auth.uid() = owner_id
    and (
      -- No tocar status: se queda igual
      status = (select status from public.videos where id = videos.id)
      -- O el dueño está auto-eliminando (active -> removed), nunca al revés
      or (
        (select status from public.videos where id = videos.id) = 'active'
        and status = 'removed'
      )
    )
  );