
-- PLACE OF ART — Supabase starter schema
create extension if not exists pgcrypto;

create table if not exists artists(
 id uuid primary key default gen_random_uuid(),
 user_id uuid unique references auth.users(id) on delete set null,
 name text unique not null,
 slug text unique not null,
 color text not null,
 specialties text,
 experience_text text,
 is_apprentice boolean not null default false,
 is_admin boolean not null default false,
 created_at timestamptz not null default now()
);

create table if not exists bookings(
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 status text not null default 'pending' check(status in ('pending','accepted','declined','cancelled','completed')),
 client_name text not null,
 date_of_birth date,
 email text,
 phone text,
 placement text,
 description text,
 artist_id uuid references artists(id),
 service text not null,
 size_option text,
 tattoo_count int default 1,
 requested_start timestamptz,
 duration_minutes int,
 deposit_due numeric(10,2) default 0,
 deposit_paid numeric(10,2) default 0,
 total_price numeric(10,2),
 price_is_starting boolean default false,
 payment_reference text
);

create table if not exists content_items(
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('news','event','healed','art','portfolio')),
 artist_id uuid references artists(id),
 title text,
 body text,
 price numeric(10,2),
 image_path text,
 event_date date,
 published boolean not null default true,
 created_at timestamptz not null default now()
);

alter table artists enable row level security;
alter table bookings enable row level security;
alter table content_items enable row level security;

create policy "public reads artists" on artists for select to anon using(true);
create policy "public reads published content" on content_items for select to anon using(published=true);
create policy "authenticated reads all bookings" on bookings for select to authenticated using(true);
create policy "authenticated updates bookings" on bookings for update to authenticated using(true) with check(true);
create policy "public creates pending bookings" on bookings for insert to anon with check(status='pending');
create policy "authenticated manages content" on content_items for all to authenticated using(true) with check(true);

insert into artists(name,slug,color,specialties,experience_text,is_apprentice,is_admin) values
('Jessie-Ann Odell','jessie-ann-odell','#b8865e','Realism, Fine Line, Micro Realism','10+ Years Experience',false,true),
('Ian Odell','ian-odell','#667e7a','Fine Line, Realism, Blackwork','8 Years Experience',false,false),
('Taylor Paige Graham','taylor-paige-graham','#8f6d55','Fine Line, Traditional','2+ Years Experience',false,false),
('Vivian Howerton','vivian-howerton','#806c8c','Traditional, Cyberpunk, Native Ornamental','1 Year Experience',false,false),
('Jaycee McKinney','jaycee-mckinney','#9b8068','Apprentice','Tattoo Apprentice',true,false)
on conflict(slug) do nothing;
