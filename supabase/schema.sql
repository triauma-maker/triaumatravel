create table if not exists public.triauma_cms_data (
  id text primary key check (id = 'global'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.triauma_cms_data enable row level security;

grant select on public.triauma_cms_data to anon, authenticated;
grant insert, update on public.triauma_cms_data to authenticated;

create table if not exists public.triauma_cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.triauma_cms_admins enable row level security;
grant select on public.triauma_cms_admins to authenticated;

drop policy if exists "Public can read CMS data" on public.triauma_cms_data;
create policy "Public can read CMS data"
  on public.triauma_cms_data for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert CMS data" on public.triauma_cms_data;
create policy "Admins can insert CMS data"
  on public.triauma_cms_data for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.triauma_cms_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update CMS data" on public.triauma_cms_data;
create policy "Admins can update CMS data"
  on public.triauma_cms_data for update
  to authenticated
  using (
    exists (
      select 1
      from public.triauma_cms_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.triauma_cms_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can verify their own access" on public.triauma_cms_admins;
create policy "Admins can verify their own access"
  on public.triauma_cms_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

create table if not exists public.triauma_customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.triauma_customer_itineraries (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.triauma_customer_profiles enable row level security;
alter table public.triauma_customer_itineraries enable row level security;

grant select, insert, update, delete on public.triauma_customer_profiles to authenticated;
grant select, insert, update, delete on public.triauma_customer_itineraries to authenticated;

drop policy if exists "Customers manage their own profile" on public.triauma_customer_profiles;
create policy "Customers manage their own profile"
  on public.triauma_customer_profiles for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Customers manage their own itineraries" on public.triauma_customer_itineraries;
create policy "Customers manage their own itineraries"
  on public.triauma_customer_itineraries for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
