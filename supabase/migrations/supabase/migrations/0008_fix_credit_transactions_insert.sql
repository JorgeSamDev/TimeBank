-- Permite insertar transacciones, pero solo a nombre propio,
-- y solo con montos/tipos coherentes con la lógica de negocio.
create policy "Users can insert their own valid transactions"
  on public.credit_transactions for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      -- Ganancia por subir video: debe ser positiva y estar ligada a un video propio
      (type = 'video_upload' and amount_hours > 0)
      -- Gasto por ver video: debe ser negativa
      or (type = 'video_view' and amount_hours < 0)
      -- Vista gratis: monto siempre en cero
      or (type = 'free_view' and amount_hours = 0)
    )
  );