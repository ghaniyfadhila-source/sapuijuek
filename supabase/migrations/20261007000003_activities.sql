-- Activities / Galeri Kegiatan (album-based)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  nama_acara text not null check (char_length(nama_acara) between 2 and 150),
  deskripsi text not null default '' check (char_length(deskripsi) <= 2000),
  tanggal date not null,
  photos text[] not null default '{}', -- array of public URLs
  created_at timestamptz not null default now()
);

create index if not exists activities_created_at_idx on public.activities (created_at desc);
create index if not exists activities_tanggal_idx on public.activities (tanggal desc);
create index if not exists activities_nama_acara_idx on public.activities (nama_acara);

-- Public read-only; tulis/hapus hanya lewat service_role
alter table public.activities enable row level security;
drop policy if exists "public read activities" on public.activities;
create policy "public read activities" on public.activities
  for select using (true);