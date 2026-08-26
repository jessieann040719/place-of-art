
-- PLACE OF ART: Supabase database schema
create extension if not exists pgcrypto;

create type if not exists booking_status as enum ('pending','accepted','declined','cancelled','completed');

create table if not exists artists (
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

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status booking_status not null default 'pending',
  client_name text not null,
  date_of_birth date not null,
  email text not null,
  phone text not null,
  placement text not null,
  description text not null,
  artist_id uuid references artists(id) on delete set null,
  tattoo_type text not null,
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

create table if not exists booking_files (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  storage_path text not null,
  original_name text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_artist_time_idx on bookings(artist_id, requested_start, requested_end);
create index if not exists bookings_status_idx on bookings(status);

alter table artists enable row level security;
alter table bookings enable row level security;
alter table booking_files enable row level security;

create policy "authenticated team reads artists"
on artists for select to authenticated using (true);

create policy "authenticated team reads bookings"
on bookings for select to authenticated using (true);

create policy "authenticated team updates bookings"
on bookings for update to authenticated using (true) with check (true);

create policy "public may create pending requests"
on bookings for insert to anon with check (status='pending');

create policy "authenticated team reads booking files"
on booking_files for select to authenticated using (true);

insert into artists(name,slug,color,specialties,experience_text,is_apprentice,is_admin)
values
('Jessie-Ann Odell','jessie-ann-odell','#b8865e','Realism, Fine Line, Micro Realism','10+ Years Experience',false,true),
('Ian Odell','ian-odell','#667e7a','Fine Line, Realism, Blackwork','8 Years Experience',false,false),
('Taylor Paige Graham','taylor-paige-graham','#8f6d55','Fine Line, Traditional','2+ Years Experience',false,false),
('Vivian Howerton','vivian-howerton','#806c8c','Traditional, Cyberpunk, Native Ornamental','1 Year Experience',false,false),
('Jaycee McKinney','jaycee-mckinney','#9b8068','Apprentice','Tattoo Apprentice',true,false)
on conflict (slug) do nothing;
