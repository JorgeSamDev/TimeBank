drop policy "Users can update their own videos, only self-delete allowed on status" on public.videos;

create policy "Users can update their own videos, only self-delete allowed on status"
  on public.videos for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (
    auth.uid() = owner_id
    and (
      status = (select v.status from public.videos v where v.id = videos.id)
      or (
        (select v.status from public.videos v where v.id = videos.id) = 'active'
        and status = 'removed'
      )
    )
  );