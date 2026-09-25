-- Customer profiles and addresses for the AURA Supabase Auth integration.
-- Role is assigned by this trusted trigger and cannot be changed by authenticated clients.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);
create unique index if not exists addresses_one_default_per_user_idx
  on public.addresses (user_id) where is_default;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;

-- Make this migration safe to retry if the SQL editor applied part of an earlier run.
drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can read their own addresses" on public.addresses;
drop policy if exists "Users can add their own addresses" on public.addresses;
drop policy if exists "Users can update their own addresses" on public.addresses;
drop policy if exists "Users can delete their own addresses" on public.addresses;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Do not allow clients to assign or modify roles.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url, updated_at) on public.profiles to authenticated;

create policy "Users can read their own addresses"
  on public.addresses for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users can add their own addresses"
  on public.addresses for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users can update their own addresses"
  on public.addresses for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Users can delete their own addresses"
  on public.addresses for delete to authenticated
  using (user_id = (select auth.uid()));

grant select, insert, update, delete on public.addresses to authenticated;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
