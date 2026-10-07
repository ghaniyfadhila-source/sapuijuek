-- Prestasi / Achievement
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  judul text not null check (char_length(judul) between 2 and 150),
  tanggal date not null,
  deskripsi text not null default '' check (char_length(deskripsi) <= 2000),
  bukti_url text not null default '' check (char_length(bukti_url) <= 500),
  member_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists achievements_created_at_idx on public.achievements (created_at desc);
create index if not exists achievements_tanggal_idx on public.achievements (tanggal desc);
create index if not exists achievements_judul_idx on public.achievements (judul);

-- Public read-only; tulis/hapus hanya lewat service_role di route handler server
alter table public.achievements enable row level security;
drop policy if exists "public read achievements" on public.achievements;
create policy "public read achievements" on public.achievements
  for select using (true);