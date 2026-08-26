-- PLACE OF ART LIVE BACKEND
-- Run this entire file once in Supabase -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  name text unique not null,
  slug text unique not null,
  color text not null,
  specialties text,
  experience_text text,
  is_apprentice boolean not null default false,
  is_admin boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check(status in ('pending','accepted','declined','cancelled','completed')),
  client_name text not null,
  date_of_birth date,
  email text,
  phone text,
  placement text,
  description text,
  artist_id uuid references public.artists(id) on delete set null,
  service text not null,
  size_option text,
  tattoo_count integer not null default 1,
  requested_start timestamptz not null,
  requested_end timestamptz,
  duration_minutes integer,
  deposit_due numeric(10,2) not null default 0,
  deposit_paid numeric(10,2) not null default 0,
  total_price numeric(10,2),
  price_is_starting boolean not null default false,
  payment_reference text,
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id)
);

create table if not exists public.booking_files (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  storage_path text not null,
  original_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check(kind in ('news','event','healed','art','portfolio')),
  artist_id uuid references public.artists(id) on delete set null,
  title text,
  body text,
  price numeric(10,2),
  image_path text,
  event_date date,
  published boolean not null default true,
  created_by uuid references public.artists(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists bookings_artist_start_idx on public.bookings(artist_id,requested_start);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists content_kind_idx on public.content_items(kind,published,created_at);

alter table public.artists enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_files enable row level security;
alter table public.content_items enable row level security;

drop policy if exists "public reads artists" on public.artists;
create policy "public reads artists" on public.artists for select to anon,authenticated using(true);

drop policy if exists "team reads bookings" on public.bookings;
create policy "team reads bookings" on public.bookings for select to authenticated using(true);

drop policy if exists "team updates bookings" on public.bookings;
create policy "team updates bookings" on public.bookings for update to authenticated using(true) with check(true);

drop policy if exists "public creates pending bookings" on public.bookings;
create policy "public creates pending bookings" on public.bookings for insert to anon,authenticated with check(status='pending');

drop policy if exists "team reads booking files" on public.booking_files;
create policy "team reads booking files" on public.booking_files for select to authenticated using(true);

drop policy if exists "public creates booking file rows" on public.booking_files;
create policy "public creates booking file rows" on public.booking_files for insert to anon,authenticated with check(true);

drop policy if exists "public reads published content" on public.content_items;
create policy "public reads published content" on public.content_items for select to anon,authenticated using(published=true or auth.role()='authenticated');

drop policy if exists "team inserts content" on public.content_items;
create policy "team inserts content" on public.content_items for insert to authenticated with check(true);

drop policy if exists "team updates content" on public.content_items;
create policy "team updates content" on public.content_items for update to authenticated using(true) with check(true);

drop policy if exists "team deletes content" on public.content_items;
create policy "team deletes content" on public.content_items for delete to authenticated using(true);

-- Storage buckets.
insert into storage.buckets(id,name,public)
values ('site-media','site-media',true)
on conflict(id) do update set public=true;

insert into storage.buckets(id,name,public)
values ('booking-references','booking-references',false)
on conflict(id) do update set public=false;

drop policy if exists "team uploads site media" on storage.objects;
create policy "team uploads site media" on storage.objects
for insert to authenticated
with check(bucket_id='site-media');

drop policy if exists "team updates site media" on storage.objects;
create policy "team updates site media" on storage.objects
for update to authenticated
using(bucket_id='site-media') with check(bucket_id='site-media');

drop policy if exists "team deletes site media" on storage.objects;
create policy "team deletes site media" on storage.objects
for delete to authenticated
using(bucket_id='site-media');

drop policy if exists "public uploads booking references" on storage.objects;
create policy "public uploads booking references" on storage.objects
for insert to anon,authenticated
with check(bucket_id='booking-references');

drop policy if exists "team reads booking references" on storage.objects;
create policy "team reads booking references" on storage.objects
for select to authenticated
using(bucket_id='booking-references');

insert into public.artists(name,slug,color,specialties,experience_text,is_apprentice,is_admin)
values
('Jessie-Ann Odell','jessie-ann-odell','#b8865e','Realism, Fine Line, Micro Realism','10+ Years Experience',false,true),
('Ian Odell','ian-odell','#667e7a','Fine Line, Realism, Blackwork','8 Years Experience',false,false),
('Taylor Paige Graham','taylor-paige-graham','#8f6d55','Fine Line, Traditional','2+ Years Experience',false,false),
('Vivian Howerton','vivian-howerton','#806c8c','Traditional, Cyberpunk, Native Ornamental','1 Year Experience',false,false),
('Jaycee McKinney','jaycee-mckinney','#9b8068','Apprentice','Tattoo Apprentice',true,false)
on conflict(slug) do update set
name=excluded.name,color=excluded.color,specialties=excluded.specialties,
experience_text=excluded.experience_text,is_apprentice=excluded.is_apprentice,is_admin=excluded.is_admin;
