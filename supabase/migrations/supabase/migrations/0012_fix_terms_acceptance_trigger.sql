create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, terms_accepted_at)
  values (new.id, new.email, now());
  return new;
end;
$$;