-- Pengaturan situs (key-value). Nilai awal = placeholder, diedit via panel admin (ticket #8)
create table if not exists public.site_settings (
  key text primary key check (char_length(key) between 1 and 50),
  value text not null default '' check (char_length(value) <= 2000),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
  for select using (true);

insert into public.site_settings (key, value) values
  ('tagline', 'Portal Digital Kelas PPLG SMKN 9 Semarang'),
  ('deskripsi_kelas', ''),
  ('guru_pembimbing', ''),
  ('tahun_berdiri', '')
on conflict (key) do nothing;
