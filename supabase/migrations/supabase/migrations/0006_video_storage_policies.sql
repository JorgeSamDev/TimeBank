-- Cualquiera puede VER videos (bucket público, necesario para reproducir en catálogo)
create policy "Videos are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'videos');

-- Un usuario autenticado solo puede subir a su propia carpeta
create policy "Users can upload their own videos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Un usuario solo puede actualizar/reemplazar sus propios archivos
create policy "Users can update their own videos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Un usuario solo puede borrar sus propios archivos
create policy "Users can delete their own videos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);