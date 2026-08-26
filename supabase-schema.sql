-- PLACE OF ART shared booking/calendar schema for Supabase

create extension if not exists pgcrypto;

create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null unique,
  color text not null,
  specialties text,
  is_admin boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create type booking_status as enum ('pending','accepted','declined','cancelled','completed');

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text,
  client_phone text,
  artist_id uuid references artists(id) on delete set null,
  tattoo_type text not null,
  size_option text,
  placement text,
  notes text,
  requested_start timestamptz not null,
  requested_end timestamptz,
  status booking_status not null default 'pending',
  deposit_paid numeric(10,2) not null default 0,
  total_price numeric(10,2),
  custom_price boolean not null default false,
  payment_reference text,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id)
);

create index if not exists bookings_artist_start_idx on bookings(artist_id, requested_start);
create index if not exists bookings_status_idx on bookings(status);

alter table artists enable row level security;
alter table bookings enable row level security;

-- Any authenticated artist can see the full shared calendar.
create policy "artists read team"
on artists for select
to authenticated
using (true);

create policy "artists read all bookings"
on bookings for select
to authenticated
using (true);

-- Authenticated artists may update booking status/details.
create policy "artists update bookings"
on bookings for update
to authenticated
using (true)
with check (true);

-- Public website may submit booking requests, but should not be able to read them back.
create policy "public create booking request"
on bookings for insert
to anon
with check (status = 'pending');

-- Seed artists. Link user_id values after each artist creates an auth account.
insert into artists (name,color,specialties,is_admin)
values
('Jessie-Ann Odell','#b8865e','Realism, Fine Line, Micro Realism',true),
('Taylor Paige Graham','#8f6d55','Fine Line, Traditional',false),
('Vivian Howerton','#806c8c','Traditional, Cyberpunk, Native Ornamental',false),
('Ian Odel','#667e7a','Fine Line, Realism, Blackwork',false)
on conflict (name) do nothing;
