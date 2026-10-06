-- Anggota kelas PPLG
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 100),
  -- text (bukan angka) agar NIS dengan leading zero tidak hilang
  nis text not null check (char_length(nis) between 4 and 20 and nis ~ '^[0-9]+$'),
  kelas_paralel text not null check (char_length(kelas_paralel) between 1 and 30),
  kontak text not null default '' check (char_length(kontak) <= 50),
  foto_url text not null default '' check (char_length(foto_url) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists members_created_at_idx on public.members (created_at desc);
create index if not exists members_nama_idx on public.members (nama);

-- Public read-only; tulis/hapus hanya lewat service_role di route handler server
alter table public.members enable row level security;
drop policy if exists "public read members" on public.members;
create policy "public read members" on public.members
  for select using (true);
